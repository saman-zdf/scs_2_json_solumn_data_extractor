type SetValue<T> = (newValue: T) => void;

type GetValue<T> = () => T;

type StateHook<T> = [GetValue<T>, SetValue<T>];

export const useState = <T>(initialValue: T): StateHook<T> => {
  let value = initialValue;

  const getValue: GetValue<T> = () => value;
  const setValue: SetValue<T> = (newValue) => {
    value = newValue;
  };
  return [getValue, setValue];
};
