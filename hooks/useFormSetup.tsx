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

interface Props<T, FORM extends FieldValues> {
  schema: ZodType;
  mutate: (v: FORM) => Promise<T>;
  queryKeyword: string;
  convertObjectToForm: (obj: T) => FORM;
  defaultValues: DefaultValues<FORM>;
  isAutoSubmit?: boolean;
  handleOnSuccess?: (data: T) => void;
}

export default function useFormSetup<T, FORM extends FieldValues>({
  schema,
  mutate,
  queryKeyword,
  convertObjectToForm,
  defaultValues,
  isAutoSubmit,
  handleOnSuccess,
}: Props<T, FORM>) {
  const { saveSuccess, saveError } = useFormToast();

  const form = useForm<FORM>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const queryClient = useQueryClient();

  const onSuccess = (data: T, _params: FORM) => {
    if (data) {
      form.reset(convertObjectToForm(data));
    }

    queryClient.invalidateQueries({ queryKey: [queryKeyword] });
    saveSuccess();
    handleOnSuccess?.(data);
  };

  const mutationFn: MutationFunction<T, FORM> = async (values: FORM) => {
    return mutate(values);
  };

  const mutation = useMutation<T, unknown, FORM>({
    mutationFn,
    onError: e => {
      e && console.error(e);
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

  const formState = form.formState;

  const submit = form.handleSubmit(values => mutation.mutate(values));

  useEffect(() => {
    if (!isAutoSubmit) return;

    if (
      formState.isDirty &&
      formState.isValid &&
      !mutation.isPending &&
      !mutation.isError
    ) {
      submit();
    }
  }, [formState, isAutoSubmit, submit, mutation.isPending, mutation.isError]);

  return { form, mutation, submit };
}
