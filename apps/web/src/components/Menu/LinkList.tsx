import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <p className="text-gray-500 text-sm font-semibold pb-3 pt-5">{props.title}</p>
      {props.children}
    </div>
  );
}
