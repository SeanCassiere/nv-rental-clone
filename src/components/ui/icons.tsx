import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowDownLeftIcon,
  ArrowUpDownIcon,
  BanIcon,
  BanknoteIcon,
  BarChartIcon,
  BellIcon,
  CalendarIcon,
  CarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsDownUpIcon,
  CircleIcon,
  ColumnsIcon,
  CopyIcon,
  CreditCardIcon,
  DollarSignIcon,
  DotIcon,
  EyeIcon,
  EyeOffIcon,
  FilesIcon,
  FileSignatureIcon,
  FlaskConicalIcon,
  FolderIcon,
  FolderXIcon,
  GripVerticalIcon,
  LaptopIcon,
  LayoutDashboardIcon,
  Loader2Icon,
  LockIcon,
  LogOutIcon,
  LucidePowerOff,
  MailPlusIcon,
  MenuIcon,
  MoonIcon,
  MoreVerticalIcon,
  MoveDownLeftIcon,
  MoveUpRightIcon,
  PencilIcon,
  PlayIcon,
  PlusCircleIcon,
  PlusIcon,
  PowerIcon,
  PrinterIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  SheetIcon,
  SortAscIcon,
  SortDescIcon,
  SunIcon,
  TrashIcon,
  UnlockIcon,
  User2Icon,
  Users2Icon,
  XIcon,
  type LucideIcon as LucideIconType,
} from "lucide-react";

export type LucideIcon = LucideIconType;

export const icons = {
  Dot: DotIcon,
  X: XIcon,
  Loading: Loader2Icon,
  Alert: AlertCircleIcon,
  Warning: AlertTriangleIcon,
  ChevronsDownUp: ChevronsDownUpIcon,
  ChevronDown: ChevronDownIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  ArrowDownLeft: ArrowDownLeftIcon,
  Experimental: FlaskConicalIcon,
  Save: SaveIcon,
  Check: CheckIcon,
  Play: PlayIcon,
  Plus: PlusIcon,
  PlusCircle: PlusCircleIcon,
  EyeOn: EyeIcon,
  EyeOff: EyeOffIcon,
  Sun: SunIcon,
  Moon: MoonIcon,
  Lock: LockIcon,
  System: LaptopIcon,
  Unlock: UnlockIcon,
  SortAsc: SortAscIcon,
  SortDesc: SortDescIcon,
  SortUnsorted: ArrowUpDownIcon,
  Activate: PowerIcon,
  Deactivate: LucidePowerOff,
  Menu: MenuIcon,
  Edit: PencilIcon,
  More: MoreVerticalIcon,
  Delete: TrashIcon,
  Search: SearchIcon,
  Logout: LogOutIcon,
  Settings: SettingsIcon,
  DashboardLayout: LayoutDashboardIcon,
  BarChart: BarChartIcon,
  Bell: BellIcon,
  Banknote: BanknoteIcon,
  Checkin: MoveDownLeftIcon,
  CreditCard: CreditCardIcon,
  Car: CarIcon,
  Calendar: CalendarIcon,
  Columns: ColumnsIcon,
  Circle: CircleIcon,
  Clear: BanIcon,
  Copy: CopyIcon,
  DollarSign: DollarSignIcon,
  FileSignature: FileSignatureIcon,
  Files: FilesIcon,
  Folder: FolderIcon,
  FolderEmpty: FolderXIcon,
  GripVertical: GripVerticalIcon,
  MailPlus: MailPlusIcon,
  Print: PrinterIcon,
  RotateBackwards: RotateCcwIcon,
  Sheet: SheetIcon,
  User: User2Icon,
  Users: Users2Icon,
  GoTo: MoveUpRightIcon,
} as const;
