import { zodResolver } from '@hookform/resolvers/zod';
import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { ZodType } from 'zod';
import useFormToast from './useFormToast';
import { useNavigation } from '@react-navigation/native';

interface Props<TForm extends FieldValues, TData> {
  schema: ZodType;
  mutate: (v: TForm) => Promise<TData>;
  onDelete: (obj: TData) => Promise<void>;
  queryKeyword: string;
  defaultValues: DefaultValues<TForm>;
  isAutoSubmit?: boolean;
  handleOnSuccess?: (data: TData) => void;
  convertDataToForm?: (data: TData) => TForm;
}

export default function useFormSetup<TForm extends FieldValues, TData>({
  schema,
  mutate,
  onDelete,
  queryKeyword,
  defaultValues,
  isAutoSubmit,
  handleOnSuccess,
  convertDataToForm = (obj: TData) => obj as unknown as TForm,
}: Props<TForm, TData>) {
  const navigation = useNavigation();
  const { deleteSuccess, saveSuccess, saveError } = useFormToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const queryClient = useQueryClient();

  const invalid = () => {
    queryClient.invalidateQueries({ queryKey: [queryKeyword] });
  };

  const onSuccess = (data: TData, _params: TForm) => {
    if (data) {
      form.reset(convertDataToForm(data));
    }
    invalid();
    saveSuccess();
    handleOnSuccess?.(data);
  };

  const mutationFn: MutationFunction<TData, TForm> = async (values: TForm) => {
    return mutate(values);
  };

  const mutation = useMutation<TData, unknown, TForm>({
    mutationFn,
    onError: e => {
      e && console.error('Form Submit Error: ', e);
      saveError();
      if (isAutoSubmit) {
        form.reset(defaultValues);
        mutation.reset();
      }
    },
    onSuccess,
    retry: 1,
    retryDelay: 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: onDelete,
    onSuccess: () => {
      deleteSuccess();
      invalid();
      navigation.goBack(); // or navigate elsewhere
    },
    onError: e => {
      e && console.error('Form delete Error: ', e);
      saveError();
    },
  });

  const { isDirty, isValid } = form.formState;

  const submit = form.handleSubmit(values => mutation.mutate(values));

  useEffect(() => {
    if (!isAutoSubmit) return;

    if (isDirty && isValid && !mutation.isPending && !mutation.isError) {
      submit();
    }
  }, [
    isDirty,
    isValid,
    isAutoSubmit,
    submit,
    mutation.isPending,
    mutation.isError,
  ]);

  return { form, mutation, submit, deleteMutation };
}
