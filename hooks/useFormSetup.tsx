import { zodResolver } from '@hookform/resolvers/zod';
import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { ZodType } from 'zod';

interface Props<T, FORM extends FieldValues> {
  // nav: (v: T) => void;
  schema: ZodType;
  mutate: (v: FORM) => Promise<T>;
  queryKeyword: string;
  convertObjectToForm: (obj: T) => FORM;
  defaultValues: DefaultValues<FORM>;
  isAutoSubmit?: boolean;
}

export default function useFormSetup<T, FORM extends FieldValues>({
  // nav,
  schema,
  mutate,
  queryKeyword,
  convertObjectToForm,
  defaultValues,
  isAutoSubmit,
}: Props<T, FORM>) {
  // const { saveErrorToast, saveSuccessToast } = useCRUDToast();

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
    // saveSuccessToast();
    // if (params.refresh && data) {
    //   nav(data.item);
    // }
  };

  const mutationFn: MutationFunction<T, FORM> = async (values: FORM) => {
    console.log('values', values);
    return mutate(values);
  };

  const mutation = useMutation<T, unknown, FORM>({
    mutationFn,
    onError: e => {
      console.error('mutate form error:', e);
      // saveErrorToast();
    },
    onSuccess,
    retry: 1,
    retryDelay: 1000,
  });

  const isDirty = form.formState.isDirty;

  const submit = form.handleSubmit(values => mutation.mutate(values));

  useEffect(() => {
    if (isAutoSubmit && isDirty) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  // const { dirty, setDirty, setPopupDialogParams } = usePopupDialog();

  // useEffect(() => {
  //   if (dirty !== form.formState.isDirty) {
  //     setDirty(form.formState.isDirty);
  //   }
  // }, [form.formState.isDirty]);

  // useEffect(() => {
  //   const params: PopupDialogParams = {
  //     title: generalStrings.exitPopup.title,
  //     description: generalStrings.exitPopup.description,
  //     cancel: {
  //       text: generalStrings.cancel,
  //     },
  //     actions: [
  //       {
  //         text: generalStrings.continueWithoutSaving,
  //         variant: 'destructive',
  //         onClick: form.reset,
  //       },
  //     ],
  //   };
  //
  //   const saveAction = {
  //     text: generalStrings.save,
  //     onClick: () => {
  //       mutation.mutate({
  //         data: form.getValues(),
  //         refresh: false,
  //       });
  //     },
  //   };

  //   if (form.formState.isValid) {
  //     params.actions = [saveAction, ...params.actions];
  //   }
  //
  //   setPopupDialogParams(params);
  // }, [form.formState.isValid, setPopupDialogParams]);

  return { form, mutation };
}
