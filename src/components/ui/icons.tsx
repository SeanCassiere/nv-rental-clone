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
  Maximize2Icon,
  MenuIcon,
  MoonIcon,
  MoreVerticalIcon,
  MoveDownLeftIcon,
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
interface SvgProps extends React.SVGProps<SVGSVGElement> {}

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
  AltMaximize: Maximize2Icon,
  Twitter: (props: SvgProps) => {
    return (
      <svg
        strokeLinejoin="round"
        viewBox="0 0 16 16"
        aria-label="Twitter"
        style={{ color: "currentcolor" }}
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z"
          fill="currentColor"
        ></path>
      </svg>
    );
  },
  GitHub: (props: SvgProps) => {
    return (
      <svg
        strokeLinejoin="round"
        viewBox="0 0 16 16"
        aria-label="GitHub"
        style={{ color: "currentcolor" }}
        {...props}
      >
        <g clipPath="url(#clip0_872_3147)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0C3.58 0 0 3.57879 0 7.99729C0 11.5361 2.29 14.5251 5.47 15.5847C5.87 15.6547 6.02 15.4148 6.02 15.2049C6.02 15.0149 6.01 14.3851 6.01 13.7154C4 14.0852 3.48 13.2255 3.32 12.7757C3.23 12.5458 2.84 11.836 2.5 11.6461C2.22 11.4961 1.82 11.1262 2.49 11.1162C3.12 11.1062 3.57 11.696 3.72 11.936C4.44 13.1455 5.59 12.8057 6.05 12.5957C6.12 12.0759 6.33 11.726 6.56 11.5261C4.78 11.3262 2.92 10.6364 2.92 7.57743C2.92 6.70773 3.23 5.98797 3.74 5.42816C3.66 5.22823 3.38 4.40851 3.82 3.30888C3.82 3.30888 4.49 3.09895 6.02 4.1286C6.66 3.94866 7.34 3.85869 8.02 3.85869C8.7 3.85869 9.38 3.94866 10.02 4.1286C11.55 3.08895 12.22 3.30888 12.22 3.30888C12.66 4.40851 12.38 5.22823 12.3 5.42816C12.81 5.98797 13.12 6.69773 13.12 7.57743C13.12 10.6464 11.25 11.3262 9.47 11.5261C9.76 11.776 10.01 12.2558 10.01 13.0056C10.01 14.0752 10 14.9349 10 15.2049C10 15.4148 10.15 15.6647 10.55 15.5847C12.1381 15.0488 13.5182 14.0284 14.4958 12.6673C15.4735 11.3062 15.9996 9.67293 16 7.99729C16 3.57879 12.42 0 8 0Z"
            fill="currentColor"
          ></path>
        </g>
        <defs>
          <clipPath id="clip0_872_3147">
            <rect width="16" height="16" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
    );
  },
} as const;
