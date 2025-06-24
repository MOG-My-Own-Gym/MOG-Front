export const ToastReducer = (state, action) => {
  switch (action.type) {
    case 'TOAST':
      console.log('TOAST');
      return { isToast: (state.isToast = true), content: action.payload };

    default:
      return { isToast: (state.isToast = false), content: state.content };
  }
};
