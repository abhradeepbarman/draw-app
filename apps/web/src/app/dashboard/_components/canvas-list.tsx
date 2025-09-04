"use client";

import { IProject } from "@/@types/project";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axios";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {};

const CanvasList = (props: Props) => {
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [listData, setListData] = useState([]);
	const [isRenaming, setIsRenaming] = useState("");
	const [name, setName] = useState("");
	const router = useRouter();

	const fetchCanvasList = async () => {
		try {
			const res = await axiosInstance.get(`/project?page=${page}`);
			setListData(res.data.data?.projects);
			setTotalPage(res.data.data?.totalPages);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await axiosInstance.delete(`/project/${id}`);
			fetchCanvasList();
		} catch (error) {
			console.log(error);
		}
	};

	const handleRename = async (id: string) => {
		setIsRenaming(id);
		try {
			await axiosInstance.put(`/project/${id}`, {
				name: "new name",
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchCanvasList();
	}, [page]);

	return (
		<div className="mt-8">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[800px]">Name</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Edited</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{listData && listData.length > 0 ? (
						listData.map((item: IProject) => (
							<TableRow key={item.id}>
								<TableCell
									className="font-medium cursor-pointer"
									onClick={() => router.push(`/canvas/${item.id}`)}
								>
									{/* {
										isRenaming === item.id ? (
											<Input
												value={name}
												onChange={(e) => setName(e.target.value)}
											/>
										) ? item.name
									} */}
									{item.name}
								</TableCell>
								<TableCell>
									{new Date(item.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{new Date(item.updatedAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0 cursor-pointer"
											>
												<span className="sr-only">Open menu</span>
												<MoreHorizontal />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => router.push(`/canvas/${item.id}`)}
											>
												Open
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleRename(item.id)}>
												Rename
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => handleDelete(item.id)}>
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={4} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{totalPage > 1 && (
				<Pagination>
					<PaginationContent>
						{page > 1 && (
							<PaginationItem onClick={() => setPage(page - 1)}>
								<PaginationPrevious href="#" />
							</PaginationItem>
						)}
						<PaginationItem>
							{page} of {totalPage} pages
						</PaginationItem>
						{page < totalPage && (
							<PaginationItem onClick={() => setPage(page + 1)}>
								<PaginationNext href="#" />
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
};

export default CanvasList;
