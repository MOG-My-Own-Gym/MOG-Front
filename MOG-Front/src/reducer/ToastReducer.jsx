export const ToastReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return { isToast: (state.isToast = true), content: action.payload };
    case 'HIDE_TOAST':
      return { isToast: (state.isToast = false), content: state.content };
    default:
      return { isToast: (state.isToast = false), content: state.content };
  }
};
