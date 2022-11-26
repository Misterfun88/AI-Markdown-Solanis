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
  DropdownMenuTrig