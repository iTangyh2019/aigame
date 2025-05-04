'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const FormSchema = z.object({
  q: z.string(),
});

export default function GameSearchForm({ defaultSearch }: { defaultSearch?: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      q: defaultSearch || '',
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!data.q.trim()) return;
    router.push(`/games/search?q=${encodeURIComponent(data.q)}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='q'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative flex w-full items-center text-white/40'>
                  <Input
                    placeholder='Search for games...'
                    {...field}
                    className='h-8 w-full rounded-full border border-white/40 !bg-transparent pr-10 placeholder:text-white/40 lg:h-[38px] lg:w-[392px] lg:pr-12'
                  />
                  <Separator className='absolute right-8 h-6 w-px bg-white/40 lg:right-10' orientation='vertical' />
                  <button type='submit' className='absolute right-2 lg:right-3'>
                    <Search className='size-[18px] lg:size-5' />
                    <span className='sr-only'>search</span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
} 