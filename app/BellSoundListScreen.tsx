import { zodResolver } from '@hookform/resolvers/zod';
import { StaticScreenProps } from '@react-navigation/native';
import { useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { Line } from '~/components/sheard/Line';
import { Separator } from '~/components/ui/separator';
import { Large } from '~/components/ui/typography';
import { useEmitValue } from '~/hooks/useEmitValue';
import { SoundPlayer } from '~/lib/SoundPlayer';
import { ADIUO_TRACKS } from '~/lib/constants';
import { Check } from '~/lib/icons/Check';

export type BellSoundListParams = {
  value: string;
};

type Props = StaticScreenProps<BellSoundListParams>;

export const BELL_SOUND_LIST_EVENT = 'BELL_SOUND_LIST_EVENT';

const schema = z.object({
  list: z.array(
    z.object({
      text: z.string().min(1),
      file: z.string().min(1),
      isSelected: z.boolean(),
    }),
  ),
});

export function BellSoundListScreen({ route }: Props) {
  const { value } = route.params;
  const [_, onChange] = useEmitValue(BELL_SOUND_LIST_EVENT, value);

  const player = useRef<SoundPlayer | null>(null);

  useEffect(() => {
    return () => {
      player.current?.release();
    };
  }, []);

  const defaultValues = useMemo(() => {
    return {
      list: ADIUO_TRACKS.map(e => {
        let isSelected = false;
        if (e.file === value) {
          player.current = new SoundPlayer(e.file);
          isSelected = true;
        }
        return { ...e, isSelected };
      }),
    };
  }, [value]);

  const {
    reset,
    formState: { isValid, isDirty },
    handleSubmit,
    control,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = handleSubmit(
    values => {
      const selectedSound = values.list.find(e => e.isSelected);
      if (!selectedSound) {
        console.error('Empty selectedSound');
        return;
      }
      onChange(selectedSound.file);
      reset(values);
    },
    errors => {
      console.error('BellSoundForm', errors);
    },
  );

  useEffect(() => {
    if (isValid && isDirty) {
      submit();
    }
  }, [isDirty, isValid, submit]);

  const { fields, update } = useFieldArray({
    control: control,
    name: 'list',
  });

  return (
    <View>
      {fields.map((field, index) => (
        <View key={field.id}>
          <Line
            index={index}
            onPress={index => {
              const selectedIndex = fields.findIndex(e => e.isSelected);
              if (selectedIndex !== -1) {
                update(selectedIndex, {
                  ...fields[selectedIndex],
                  isSelected: false,
                });
                player.current?.replaceTrack(field.file, true);
              }
              update(index, {
                ...fields[index],
                isSelected: true,
              });
            }}>
            <>
              <Large>{field.text}</Large>
              {field.isSelected && <Check className="text-foreground" />}
            </>
          </Line>
          <Separator className="mx-5 w-fit" />
        </View>
      ))}
    </View>
  );
}
