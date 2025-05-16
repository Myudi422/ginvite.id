'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { Collapsible } from './Collapsible';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

interface Music {
  Nama_lagu: string;
  link_lagu: string;
  kategori: string;
}

export function MusicSection() {
  const { control, setValue, watch } = useFormContext();
  const [musicList, setMusicList] = useState<Music[]>([]);
  const isMusicEnabled = watch('music.enabled');
  const selectedMusicUrl = watch('music.url');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicList = async () => {
      try {
        const response = await fetch('https://ccgnimex.my.id/v2/android/ginvite/index.php?action=musiclist');
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setMusicList(data.data);
        }
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };

    fetchMusicList();
  }, []);

  const handleMusicSelect = (url: string) => {
    setValue('music.url', url);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentPlaying(null);
    }
  };

  const handlePlayPause = (url: string) => {
    if (!audioRef.current || audioRef.current.src !== url) {
      audioRef.current = new Audio(url);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentPlaying(null);
      });
    }

    if (isPlaying && currentPlaying === url) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentPlaying(url);
    }
  };

  return (
    <Collapsible title="Latar Belakang Musik">
      <div className="grid gap-4 py-4">
        <FormField
          control={control}
          name="music.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Aktifkan Latar Musik</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {isMusicEnabled && (
          <div className="space-y-4">
            <FormField
              control={control}
              name="music.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pilih Musik</FormLabel>
                  <Select onValueChange={handleMusicSelect} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih lagu..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {musicList.map((music) => (
                        <SelectItem
                          key={music.link_lagu}
                          value={music.link_lagu}
                          className="py-2 hover:bg-accent"
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            {/* Spacer untuk kiri */}
                            <div className="w-6 flex-shrink-0" />

                            {/* Nama lagu */}
                            <div className="flex-1 min-w-0 text-center overflow-hidden">
                              <p className="truncate font-medium">{music.Nama_lagu}</p>
                            </div>

                            {/* Kategori */}
                            <div className="w-auto flex justify-end max-w-[100px]">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent-foreground truncate">
                                {music.kategori}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {selectedMusicUrl && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handlePlayPause(selectedMusicUrl)}
                  variant="outline"
                  className="shrink-0"
                >
                  {currentPlaying === selectedMusicUrl && isPlaying ? (
                    <PauseIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <PlayIcon className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying && currentPlaying === selectedMusicUrl ? 'Jeda' : 'Mainkan'}
                </Button>

                <div className="flex flex-col gap-1 min-w-0 max-w-full overflow-hidden">
                  <p className="truncate text-sm font-medium">
                    {musicList.find(m => m.link_lagu === selectedMusicUrl)?.Nama_lagu}
                  </p>
                  <span className="truncate text-xs text-muted-foreground">
                    {musicList.find(m => m.link_lagu === selectedMusicUrl)?.kategori}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Collapsible>
  );
}
