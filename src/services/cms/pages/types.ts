export type ComponentConfig = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: ComponentConfig[];
};

export type SlotConfig = {
  slotId: string;
  components: ComponentConfig[];
};

export type PageConfig = {
  templateId: string;
  slots: SlotConfig[];
  meta?: {
    title?: string;
    theme?: string;
  };
};
