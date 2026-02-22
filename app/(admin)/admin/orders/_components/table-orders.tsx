"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import formatDate, { sortByDate } from "@/app/utils/formateDate";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import TitleHeader from "@/app/(admin)/_components/title-header";

type OrderItem = {
  id: string;
  orderId: string;
  productName: string;
  customDesign?: string;
  customDesignBack?: string;
};

type Order = {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  userEmail: string;
  trackingNumber: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  orderItems: OrderItem[];
};

const TableOrders = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/orders");
      const sortedData = sortByDate(data);
      return sortedData as Order[];
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { trackingNumber });
      toast.success("Tracking number updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error("Failed to update tracking");
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { isPaid: true });
      toast.success("Order marked as paid");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      toast.error("Failed to mark as paid");
    }
  };

  const offset = currentPage * productsPerPage;
  const currentProducts = data?.slice(offset, offset + productsPerPage);

  const handlePageClick = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }
  return (
    <>
      <TitleHeader
        title="Orders"
        count={data?.length}
        description="Manage orders for your store"
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <p className="text-gray-700">Products</p>
              </TableCell>
              <TableCell>
                <p className="text-gray-700">Customer</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Total</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Paid</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Status</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Tracking #</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.orderItems.map(item => item.productName).join(", ")}
                </TableCell>
                <TableCell align="left">
                  <div>
                    <p className="text-sm">{order.userEmail || "—"}</p>
                    <p className="text-xs text-gray-400">{order.phone || "—"}</p>
                  </div>
                </TableCell>
                <TableCell align="center">
                  ₦{Number(order.totalAmount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="center">
                  {order.isPaid ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkAsPaid(order.id)}
                      className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200 transition-colors cursor-pointer"
                      title="Click to mark as paid"
                    >
                      Unpaid — Mark Paid ✓
                    </button>
                  )}
                </TableCell>
                <TableCell align="center">
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </TableCell>
                <TableCell align="center">
                  <input
                    type="text"
                    defaultValue={order.trackingNumber || ""}
                    placeholder="Enter tracking #"
                    className="border rounded p-1 text-sm w-36"
                    onBlur={(e) => {
                      if (e.target.value !== order.trackingNumber) {
                        handleTrackingUpdate(order.id, e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  {formatDate(order.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(data?.length / productsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex space-x-2 justify-end mt-4"}
          previousLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          nextLinkClassName={"bg-neutral-800 px-4 py-2 rounded text-white"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-700"}
          pageClassName="hidden"
        />
      )}
    </>
  );
};

export default TableOrders;
