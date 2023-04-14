export const useState = (initialValue) => {
    let value = initialValue;
    const getValue = () => value;
    const setValue = (newValue) => {
        value = newValue;
    };
    return [getValue, setValue];
};
