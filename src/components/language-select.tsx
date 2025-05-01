import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages } from '@/common/utils/languages';

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className='flex items-center gap-1'>
      <p className='text-sm'>Language</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Select language' />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languages).map(([category, langs]) => (
            <div key={category}>
              <div className='px-2 py-1.5 text-xs font-semibold text-muted-foreground'>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </div>
              {langs.map(lang => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
