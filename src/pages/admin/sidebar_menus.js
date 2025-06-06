
import { MdGroups, MdOutlinePayment, MdPhonelinkSetup } from "react-icons/md";
import { IoMdClose, IoMdSend, IoMdSettings } from "react-icons/io";
import { BiMenu } from "react-icons/bi";
import {
  FaCreditCard,
  FaMoneyBill,
  FaCheck,
  FaTicketAlt,
  FaUser,
  FaUserPlus,
  FaIdBadge
} from "react-icons/fa";
import { RiDashboardFill, RiMenuFoldFill } from "react-icons/ri";
import { TbArrowBarLeft } from "react-icons/tb";
import { HiMiniTableCells } from "react-icons/hi2";
import { BsNodePlusFill } from "react-icons/bs";
import { LiaHourglassEndSolid } from "react-icons/lia";

export const sidebarMenu = (isSuperAdmin, user) => [
  {
    id: 1,
    label: "Dashboard",
    path: "/main/dashboard",
    icon: <RiDashboardFill />,
  },
  {
    id: 2,
    label: "Users",
    path: "/main/users",
    icon: <FaUser />,
  },
  {
    id: 3,
    label: "KYC",
    path: "/main/kyc",
    icon: <FaIdBadge />,
  },
  {
    id: 4,
    label: "Transaction",
    path: "/main/transaction",
    icon: <MdOutlinePayment />,
  },
  {
    id: 5,
    label: "Societies",
    path: isSuperAdmin
      ? "/main/societies"
      : `/main/edit-society/${user?.Group?.id}`,
    icon: <MdGroups />,
  },
  {
    id: 6,
    label: "Deposit Money",
    path: "/main/deposit-money",
    icon: <FaCreditCard />,
  },
  {
    id: 7,
    label: "Send Money",
    path: "/main/send-money",
    icon: <IoMdSend />,
  },
  {
    id: 8,
    label: "Create New User",
    path: "/main/create-user",
    icon: <FaUserPlus />,
  },
  ...(isSuperAdmin
    ? [
        {
          id: 9,
          label: "Create Role",
          path: "/main/create-role",
          icon: <HiMiniTableCells />,
        },
        {
          id: 10,
          label: "Create Society",
          path: "/main/create-society",
          icon: <BsNodePlusFill />,
        },
      ]
    : []),
  {
    id: 11,
    label: "Withdrawals",
    path: "/main/withdrawal-requests",
    icon: <FaMoneyBill />,
  },
  {
    id: 12,
    label: "Registrations",
    path: "/main/registration-applications",
    icon: <MdPhonelinkSetup />,
  },
  {
    id: 13,
    label: "Loans",
    icon: <LiaHourglassEndSolid />,
    children: [
          { id: 1311, label: "Declined", icon: <IoMdClose />, path: "/main/loan-applications/declined" },
          { id: 1312, label: "Pending", icon: <TbArrowBarLeft />, path: "/main/loan-applications/pending" },
          { id: 1313, label: "Approved", icon: <RiMenuFoldFill />, path: "/main/loan-applications/approved" },
          { id: 1314, label: "Completed", icon: <FaCheck />, path: "/main/loan-applications/completed" },
        ],
  },
  {
    id: 14,
    label: "Settings",
    path: "/main/setting",
    icon: <IoMdSettings />,
  },
  
];
