declare module '@barba/core' {
  interface BarbaTransition {
    name: string;
    leave?: (data: any) => Promise<any> | any;
    enter?: (data: any) => Promise<any> | any;
    custom?: (data: any) => boolean;
  }

  interface BarbaView {
    namespace: string;
    beforeEnter?: () => void;
    afterEnter?: () => void;
    beforeLeave?: () => void;
    afterLeave?: () => void;
  }

  interface BarbaConfig {
    transitions?: BarbaTransition[];
    views?: BarbaView[];
  }

  interface BarbaHooks {
    before: (callback: () => void) => void;
    after: (callback: () => void) => void;
    enter: (callback: () => void) => void;
    leave: (callback: () => void) => void;
  }

  interface Barba {
    init: (config: BarbaConfig) => void;
    destroy: () => void;
    hooks: BarbaHooks;
  }

  const barba: Barba;
  export default barba;
}