"use client";
import TitleHeader from "@/app/(admin)/_components/title-header";
import axios from "axios";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/app/utils/formateDate";
import Spinner from "@/components/Spinner";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";

type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  isAdmin: boolean;
  createdAt: string;
};

const UserTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;
  const queryClient = useQueryClient();

  const { error, data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get<User[]>("/api/users");
      return res.data;
    },
  });

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
        title="Manage user"
        description="Manage admin users"
        url="/admin/users/new"
        count={data?.length}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={5}>
                <p className="text-gray-700">Image</p>
              </TableCell>

              <TableCell>
                <p className="text-gray-700">Name</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Role</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Email</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Date</p>
              </TableCell>
              <TableCell align="center">
                <p className="text-gray-700">Actions</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts?.map((user: User) => {
              return (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.image ? (
                      <Image
                        src={`${user.image}`}
                        alt="User Image"
                        className="border rounded-full"
                        width={60}
                        height={60}
                      />
                    ) : (
                      <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {user.name || "No Name"}
                  </TableCell>
                  <TableCell align="center">
                    {user.isAdmin ? "Admin" : "User"}
                  </TableCell>
                  <TableCell align="center">
                    {user.email}
                  </TableCell>
                  <TableCell align="center">
                    <p>{formatDate(user.createdAt)}</p>
                  </TableCell>
                  <TableCell align="center">
                    <button onClick={() => deleteUser(user.id)}>
                      <DeleteIcon className="text-red-600" />
                    </button>
                    {/* Link to edit page if implemented, typically prisma logic differs from clerk */}
                    {/* <Link href={`/admin/users/edit/${user.id}`}>
                      <EditIcon />
                    </Link> */}
                  </TableCell>
                </TableRow>
              );
            })}
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

export default UserTable;
