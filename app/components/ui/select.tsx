import { cn } from "@/lib/utils";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
} from "./shadcn-select";

interface SelectProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
}

const Select = (props: SelectProps) => {
  return (
    <ShadcnSelect onValueChange={props.onChange} value={props.value}>
      <ShadcnSelectTrigger
        className={cn('bg-background',
          !props.value && "text-muted-foreground",
          props.className,
        )}
      >
        {props.options.find((option) => option.value === props.value)?.label ??
          props.placeholder}
      </ShadcnSelectTrigger>
      <ShadcnSelectContent>
        {props.options.map((option) => (
          <ShadcnSelectItem
            key={option.value}
            value={option.value}
            className={cn(
              props.value === option.value &&
                "bg-primary/5 text-primary",
            )}
          >
            {option.label}
          </ShadcnSelectItem>
        ))}
      </ShadcnSelectContent>
    </ShadcnSelect>
  );
};

export default Select;
