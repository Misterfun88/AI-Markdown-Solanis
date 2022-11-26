"use client";

import { useEffect, useRef, useState } from "react";
import {
  GridItemHTMLElement,
  GridStack,
  GridStackNode,
  GridStackWidget,
} from "gridstack";
import "gridstack/dist/gridstack.min.css";
import { v4 as uuidv4 } from "uuid";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  FileStack,
  Kanban,
  LineChart,
  LucideX,
  PieChart,
  PlusIcon,
  Sparkles,
} from "lucide-react";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { cn } from "@/lib/utils";

interface Props {}

type Widget = {
  id: number | string;
  type: string;
  h: number;
  w: number;
  x?: number;
  y?: number;
  static?: boolean;
  removed?: boolean;
};

//TODO: Implement the rest of the widgets
//TODO: Switch to components for each widget to make it easier to add new ones and calling api's
//TODO: Add a way to save the dashboard

let grid: GridStack;

export default function Dashboard({}: Props) {
  const name = "Gustavo";
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const widgetsRef = useRef(new Map());

  const getWidgetsMap = () => {
    return widgetsRef.current;
  };

  const createWidget = (type: string) => {
    //todo: calculate the best position to add the widget and h w
    return {
      id: uuidv4(),
      type,
      h: 2,
      w: 2,
      static: false,
    };
  };

  const addWidget = (type: string) => {
    const newWidget = createWidget(type);

    setWidgets([...widgets, newWidget]);

    setTimeout(() => {
      grid.addWidget(getWidgetsMap().get(newWidget.id));
    }, 5);
  };

  const removeWidget = (id: string) => {
    const el = document.querySelector(
      `.grid-stack-item[gs-id="${id}"]`,
    ) as GridItemHTMLElement;

    //set removed
    setWidgets((prev) =>
      prev.map((widg) => {
        if (widg.id === id) {
          return { ...widg, removed: true };
        }
        return widg;
      }),
    );

    if (el) {
      grid.removeWidget(el);
      widgetsRef.current.delete(id);
    }
  };

  const Widget = (widget: Widget) => {
    return (
      <div>
        {widget.type}
        <Button
          variant={"destructive"}
          className="absolute top-1 right-1 p-1 h-min hidden group-hover:flex"
          onClick={() => removeWidget(widget.id as string)}
        >
          <LucideX size={10} />
        </Button>
      </div>
    );
  };

  useEffect(() => {
    grid = GridStack.init({ margin: 6, row: 8, styleInHead: true });

    grid.on("dragstop", function (_event: Event, el: GridItemHTMLElement) {
      if (!el.gridstackNode) {
        throw new Error(`Error resizing element: ${el}`);
      }

      let node: GridStackNode = el.gridstackNode;
      setWidgets((prev) =>
        prev.map((widg) => {
          if (widg.id === node.id) {
            return { ...widg, x: node.x, y: node.y };
          }
          return widg;
        }),
      );
    });

    grid.on("resizestop", function (event: Event, el: GridItemHTMLElement) {
      if (!el.gridstackNode) {
        throw new Error(`Error resizing element: ${el}`);
      }

      let node: GridStackNode = el.gridstackNode;
      setWidgets((prev) =>
        prev.map((widg) => {
          if (widg.id === node.id) {
            const newWidg = { ...widg, w: node.w ?? 0, h: node.h ?? 0 };
            return newWidg;
          }
          return widg;
        }),
      );
    });
  }, []);

  useEffect(() => {
    const saved = grid.save(true) as GridStackWidget[];
    // setWidgets(saved.map((widg: any) => ({ .