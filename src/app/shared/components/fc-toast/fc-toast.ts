export interface FcToast {
  severity?: string;
  header?: string;
  subheader?: string;
  message?: string;
  id?: any;
  key?: string;
  life?: number; // duration toast by milisecond
  sticky?: boolean; // if true, toast will not close automatically
  closable?: boolean;
  data?: any;
  icon?: string;
  contentStyleClass?: string;
  styleClass?: string;
  showed?: boolean;
  type?: string;
  actionButtons?: FcToastButton[];
  lottieOption?: any;
}
export interface FcToastButton {
  label?: string;
  icon?: any;
  class?: string;
  action?: any;
}
