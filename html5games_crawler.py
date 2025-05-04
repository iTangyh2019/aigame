#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
HTML5游戏爬虫

这个脚本用于爬取HTML5games.com网站上的游戏数据，
提取游戏标题、描述、缩略图、游戏链接和标签，
并将数据保存为JSON格式。
"""

import json
import logging
import os
from pathlib import Path
from typing import Dict, List, Optional, Set

import requests
from bs4 import BeautifulSoup

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


class HTML5GamesCrawler:
    """HTML5游戏爬虫类，用于爬取HTML5games.com网站的游戏数据。"""
    
    def __init__(self, url: str, output_file: str, batch_size: int = 100):
        """
        初始化爬虫。
        
        Args:
            url: 要爬取的网页URL
            output_file: 输出文件路径
            batch_size: 每次爬取的游戏数量
        """
        self.url = url
        self.output_file = output_file
        self.batch_size = batch_size
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # 用于存储已爬取游戏的标题，实现去重
        self.crawled_games: Set[str] = set()
        # 存储已有的游戏数据
        self.existing_games: List[Dict[str, str]] = []
        # 加载已有的游戏数据
        self.load_existing_games()
    
    def load_existing_games(self) -> None:
        """加载已有的游戏数据，用于去重。"""
        if os.path.exists(self.output_file):
            try:
                with open(self.output_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:  # 确保文件不为空
                        self.existing_games = json.loads(content)
                        if not isinstance(self.existing_games, list):
                            self.existing_games = [self.existing_games]
                        
                        # 提取所有游戏标题到集合中，用于去重
                        for game in self.existing_games:
                            if isinstance(game, dict) and 'title' in game:
                                self.crawled_games.add(game['title'])
                
                logger.info(f"已从 {self.output_file} 加载 {len(self.crawled_games)} 个游戏")
            except json.JSONDecodeError:
                logger.warning(f"无法解析 {self.output_file}，将创建新文件")
                self.existing_games = []
            except IOError as e:
                logger.error(f"读取文件失败: {e}")
                self.existing_games = []
    
    def fetch_page(self) -> Optional[str]:
        """
        获取网页内容。
        
        Returns:
            网页的HTML内容，如果请求失败则返回None
        """
        try:
            response = requests.get(self.url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logger.error(f"获取网页失败: {e}")
            return None
    
    def parse_games(self, html: str) -> List[Dict[str, str]]:
        """
        解析HTML内容，提取游戏数据。
        
        Args:
            html: 网页的HTML内容
            
        Returns:
            包含游戏数据的字典列表
        """
        soup = BeautifulSoup(html, 'html.parser')
        games_data = []
        games_count = 0
        
        # 查找所有游戏元素
        game_elements = soup.select('a[href^="/Game/"]')
        
        for game in game_elements:
            # 如果已经达到批次大小，则停止
            if games_count >= self.batch_size:
                break
                
            title = game.get_text(strip=True)
            
            # 跳过已爬取的游戏
            if title in self.crawled_games:
                logger.info(f"跳过已爬取的游戏: {title}")
                continue
            
            # 获取游戏链接
            game_url = f"https://html5games.com{game['href']}" if game.has_attr('href') else ""
            
            # 获取游戏详细信息
            game_info = self.get_game_details(game_url)
            if game_info:
                games_data.append({
                    "title": title,
                    "description": game_info.get("description", ""),
                    "cover_image": game_info.get("cover_image", ""),
                    "game_url": game_info.get("game_url", ""),
                    "tags": game_info.get("tags", "")
                })
                self.crawled_games.add(title)
                games_count += 1
                logger.info(f"已爬取游戏: {title}")
        
        return games_data
    
    def get_game_details(self, game_url: str) -> Dict[str, str]:
        """
        获取游戏详细信息。
        
        Args:
            game_url: 游戏页面的URL
            
        Returns:
            包含游戏详细信息的字典
        """
        try:
            response = requests.get(game_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取游戏描述
            description = ""
            desc_elem = soup.select_one('p[itemprop="description"]')
            if desc_elem:
                description = desc_elem.get_text(strip=True)
            
            if not description:
                description_elem = soup.select_one('meta[name="description"]')
                description = description_elem['content'] if description_elem else ""
            
            # 提取游戏缩略图
            cover_image = ""
            img_elem = soup.select_one('img[itemprop="image"]')
            if img_elem and img_elem.has_attr('src'):
                cover_image = img_elem['src']
            
            if not cover_image:
                img_selectors = [
                    '.game-image img', 
                    '.game-cover img',
                    '.game-thumbnail img',
                    'meta[property="og:image"]',
                    '.game-header img'
                ]
                
                for selector in img_selectors:
                    img_elem = soup.select_one(selector)
                    if img_elem:
                        if selector.startswith('meta'):
                            cover_image = img_elem.get('content', '')
                        else:
                            cover_image = img_elem.get('src', '')
                        if cover_image:
                            break
            
            # 提取游戏标签
            tags = []
            tag_selectors = [
                '.game-tags a', 
                '.game-categories a',
                '.game-info .tags a',
                '.game-meta .category'
            ]
            
            for selector in tag_selectors:
                tag_elems = soup.select(selector)
                if tag_elems:
                    for tag in tag_elems:
                        tag_text = tag.get_text(strip=True)
                        if tag_text:
                            tags.append(tag_text)
                    if tags:
                        break
            
            if not tags:
                keywords = soup.select_one('meta[name="keywords"]')
                if keywords and keywords.has_attr('content'):
                    tags = [tag.strip() for tag in keywords['content'].split(',')]
            
            # 提取游戏真实链接
            initial_game_url = ""
            
            # 尝试找到class="aff-iliate-link"的textarea
            textarea_elem = soup.select_one('textarea.aff-iliate-link')
            if textarea_elem:
                initial_game_url = textarea_elem.get_text(strip=True)
            
            # 如果上面的方法失败，继续尝试其他方法
            if not initial_game_url:
                # 尝试从iframe中获取
                iframe = soup.select_one('iframe#game-iframe')
                if iframe and iframe.has_attr('src'):
                    initial_game_url = iframe['src']
                
                # 尝试从play按钮或其他链接获取
                if not initial_game_url:
                    play_buttons = soup.select('a.play-button, a.game-play-button, a[href*="play"]')
                    for button in play_buttons:
                        if button.has_attr('href'):
                            initial_game_url = button['href']
                            if not initial_game_url.startswith('http'):
                                initial_game_url = f"https://html5games.com{initial_game_url}"
                            break
                
                # 尝试从页面中查找包含play.famobi.com的链接
                if not initial_game_url:
                    all_links = soup.select('a[href*="play.famobi.com"], a[href*="game.famobi.com"]')
                    if all_links:
                        initial_game_url = all_links[0]['href']
                
                # 尝试直接在HTML中查找可能的游戏URL
                if not initial_game_url:
                    html_str = str(soup)
                    import re
                    # 查找可能的游戏URL模式
                    url_patterns = [
                        r'https?://play\.famobi\.com/[^"\']+',
                        r'https?://game\.famobi\.com/[^"\']+',
                        r'https?://games\.famobi\.com/[^"\']+',
                        r'gameUrl\s*:\s*["\']([^"\']+)["\']',
                        r'game_url\s*:\s*["\']([^"\']+)["\']'
                    ]
                    
                    for pattern in url_patterns:
                        matches = re.findall(pattern, html_str)
                        if matches:
                            initial_game_url = matches[0]
                            # 如果匹配到的是正则表达式中的捕获组
                            if pattern.endswith('["\']'):
                                initial_game_url = matches[0]
                            break
            
            # 如果所有方法都失败，使用原始游戏页面URL
            if not initial_game_url:
                initial_game_url = game_url
            
            # 获取重定向后的真实游戏URL
            real_game_url = self.get_redirected_url(initial_game_url)
            
            # 记录调试信息
            logger.info(f"游戏: {game_url}")
            logger.info(f"  - 描述: {description[:50]}...")
            logger.info(f"  - 缩略图: {cover_image}")
            logger.info(f"  - 标签: {tags}")
            logger.info(f"  - 初始链接: {initial_game_url}")
            logger.info(f"  - 真实链接: {real_game_url}")
            
            return {
                "description": description,
                "cover_image": cover_image,
                "game_url": real_game_url,
                "tags": ", ".join(tags)
            }
        except requests.RequestException as e:
            logger.error(f"获取游戏详情失败 {game_url}: {e}")
            return {}
    
    def get_redirected_url(self, url: str) -> str:
        """
        获取重定向后的真实URL。
        
        Args:
            url: 初始URL
            
        Returns:
            重定向后的真实URL
        """
        try:
            # 特殊处理play.famobi.com链接
            if 'play.famobi.com' in url:
                # 提取游戏ID
                import re
                game_id_match = re.search(r'play\.famobi\.com/([^/?]+)', url)
                if game_id_match:
                    game_id = game_id_match.group(1)
                    logger.info(f"从URL中提取到游戏ID: {game_id}")
                    
                    # 尝试直接构造最终游戏URL
                    # 这里我们需要获取完整的游戏参数，所以先请求原始页面
                    try:
                        response = requests.get(url, headers=self.headers, timeout=10)
                        response.raise_for_status()
                        html_content = response.text
                        
                        # 查找最终游戏URL
                        final_url_patterns = [
                            r'https?://games\.cdn\.famobi\.com/html5games/[^"\']+',
                            r'https?://play\.famobi\.com/html5games/[^"\']+',
                            r'https?://famobi\.com/html5games/[^"\']+',
                            r'iframe\.src\s*=\s*[\'"]([^\'"]+)[\'"]',
                            r'game_url\s*:\s*[\'"]([^\'"]+)[\'"]',
                            r'gameUrl\s*:\s*[\'"]([^\'"]+)[\'"]'
                        ]
                        
                        for pattern in final_url_patterns:
                            matches = re.search(pattern, html_content)
                            if matches:
                                if '(' in pattern:  # 如果是捕获组
                                    final_url = matches.group(1)
                                else:
                                    final_url = matches.group(0)
                                
                                logger.info(f"找到最终游戏URL: {final_url}")
                                return final_url
                    except Exception as e:
                        logger.error(f"获取最终游戏URL失败: {e}")
            
            # 设置不自动重定向
            session = requests.Session()
            response = session.get(
                url, 
                headers=self.headers, 
                timeout=10, 
                allow_redirects=False
            )
            
            # 如果有HTTP重定向
            if response.status_code in (301, 302, 303, 307, 308) and 'Location' in response.headers:
                redirect_url = response.headers['Location']
                
                # 如果是相对URL，转换为绝对URL
                if not redirect_url.startswith('http'):
                    from urllib.parse import urljoin
                    redirect_url = urljoin(url, redirect_url)
                
                logger.info(f"发现HTTP重定向: {url} -> {redirect_url}")
                
                # 递归跟踪所有重定向
                return self.get_redirected_url(redirect_url)
            
            # 如果没有HTTP重定向，但需要进一步检查页面中的其他重定向方式
            elif response.status_code == 200:
                html_content = response.text
                soup = BeautifulSoup(html_content, 'html.parser')
                
                # 检查meta刷新重定向
                meta_refresh = soup.select_one('meta[http-equiv="refresh"]')
                if meta_refresh and meta_refresh.has_attr('content'):
                    content = meta_refresh['content']
                    import re
                    # 提取URL部分
                    match = re.search(r'url=([^;]+)', content, re.IGNORECASE)
                    if match:
                        redirect_url = match.group(1).strip()
                        # 如果是相对URL，转换为绝对URL
                        if not redirect_url.startswith('http'):
                            from urllib.parse import urljoin
                            redirect_url = urljoin(url, redirect_url)
                        
                        logger.info(f"发现meta刷新重定向: {url} -> {redirect_url}")
                        return self.get_redirected_url(redirect_url)
                
                # 检查iframe
                iframe = soup.select_one('iframe[src]')
                if iframe and iframe.has_attr('src'):
                    iframe_src = iframe['src']
                    if iframe_src.startswith('http'):
                        logger.info(f"发现iframe重定向: {url} -> {iframe_src}")
                        return self.get_redirected_url(iframe_src)
                    elif iframe_src:
                        from urllib.parse import urljoin
                        iframe_src = urljoin(url, iframe_src)
                        logger.info(f"发现iframe重定向: {url} -> {iframe_src}")
                        return self.get_redirected_url(iframe_src)
                
                # 检查JavaScript重定向
                scripts = soup.select('script')
                for script in scripts:
                    script_text = script.get_text()
                    # 检查常见的JavaScript重定向模式
                    redirect_patterns = [
                        r'window\.location(?:\.href)?\s*=\s*[\'"]([^\'"]+)[\'"]',
                        r'location\.replace\([\'"]([^\'"]+)[\'"]\)',
                        r'location\.href\s*=\s*[\'"]([^\'"]+)[\'"]'
                    ]
                    
                    for pattern in redirect_patterns:
                        import re
                        matches = re.search(pattern, script_text)
                        if matches:
                            redirect_url = matches.group(1)
                            # 如果是相对URL，转换为绝对URL
                            if not redirect_url.startswith('http'):
                                from urllib.parse import urljoin
                                redirect_url = urljoin(url, redirect_url)
                            
                            logger.info(f"发现JavaScript重定向: {url} -> {redirect_url}")
                            return self.get_redirected_url(redirect_url)
                
                # 特殊处理：查找页面中可能的最终游戏URL
                if 'famobi' in url:
                    # 查找可能的最终游戏URL模式
                    import re
                    final_url_patterns = [
                        r'https?://games\.cdn\.famobi\.com/html5games/[^"\']+',
                        r'https?://play\.famobi\.com/html5games/[^"\']+',
                        r'https?://famobi\.com/html5games/[^"\']+',
                        r'iframe\.src\s*=\s*[\'"]([^\'"]+)[\'"]',
                        r'game_url\s*:\s*[\'"]([^\'"]+)[\'"]',
                        r'gameUrl\s*:\s*[\'"]([^\'"]+)[\'"]'
                    ]
                    
                    for pattern in final_url_patterns:
                        matches = re.search(pattern, html_content)
                        if matches:
                            if '(' in pattern:  # 如果是捕获组
                                final_url = matches.group(1)
                            else:
                                final_url = matches.group(0)
                            
                            logger.info(f"找到最终游戏URL: {final_url}")
                            return final_url
            
            # 如果没有发现任何重定向，返回原始URL
            return url
        except requests.RequestException as e:
            logger.error(f"获取重定向URL失败 {url}: {e}")
            return url
    
    def save_games(self, games: List[Dict[str, str]]) -> None:
        """
        保存游戏数据到文件。
        
        Args:
            games: 包含游戏数据的字典列表
        """
        # 合并新数据和现有数据
        all_games = self.existing_games + games
        
        # 去重（基于标题）
        unique_games = []
        seen_titles = set()
        for game in all_games:
            if game['title'] not in seen_titles:
                unique_games.append(game)
                seen_titles.add(game['title'])
        
        # 保存到文件
        try:
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(unique_games, f, ensure_ascii=False, indent=2)
            logger.info(f"已保存 {len(games)} 个新游戏，总共 {len(unique_games)} 个游戏")
        except IOError as e:
            logger.error(f"保存数据失败: {e}")
    
    def run(self) -> None:
        """运行爬虫。"""
        logger.info(f"开始爬取 {self.url}")
        html = self.fetch_page()
        if html:
            games = self.parse_games(html)
            if games:
                self.save_games(games)
                logger.info(f"成功爬取 {len(games)} 个游戏")
            else:
                logger.warning("未找到任何新游戏")
        else:
            logger.error("爬取失败")


def main():
    """主函数。"""
    # 创建输出目录（如果不存在）
    output_file = Path("games.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # 初始化并运行爬虫
    url = "https://html5games.com/All-Games"
    crawler = HTML5GamesCrawler(url, str(output_file))
    crawler.run()


if __name__ == "__main__":
    main() 