//btn text-black hover:bg-white hover:opacity-90 rounded-full btn-sm bg-white



import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading: isLoadingSuggested } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to get suggested users");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { data: followedUsers, isLoading: isLoadingFollowed } = useQuery({
		queryKey: ["followedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/following");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to get followed users");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { follow, isPending } = useFollow();

	if (!suggestedUsers?.length && !followedUsers?.length) return <div className="md:w-64 w-0"></div>;

	return (
		<div className='lg:block my-4 mx-2 w-[80%]'>
			<div className='bg-gray-800 p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{isLoadingSuggested && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoadingSuggested &&
						suggestedUsers?.map((user) => (
							<Link to={`/profile/${user.username}`} className='flex items-center justify-between gap-4' key={user._id}>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>{user.fullname}</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button className="bg-white rounded-full text-black font-bold border-white btn-sm hover:bg-slate-400" onClick={(e) => { e.preventDefault(); follow(user._id); }}>
										{isPending ? <LoadingSpinner size="sm" /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
				{followedUsers?.length > 0 && (
					<>
						<p className='font-bold mt-4'>Following</p>
						<div className='flex flex-col gap-4'>
							{isLoadingFollowed && (
								<>
									<RightPanelSkeleton />
									<RightPanelSkeleton />
									<RightPanelSkeleton />
									<RightPanelSkeleton />
								</>
							)}
							{!isLoadingFollowed &&
								followedUsers?.map((user) => (
									<Link to={`/profile/${user.username}`} className='flex items-center justify-between gap-4' key={user._id}>
										<div className='flex gap-2 items-center'>
											<div className='avatar'>
												<div className='w-8 rounded-full'>
													<img src={user.profileImg || "/avatar-placeholder.png"} />
												</div>
											</div>
											<div className='flex flex-col'>
												<span className='font-semibold tracking-tight truncate w-28'>{user.fullname}</span>
												<span className='text-sm text-slate-500'>@{user.username}</span>
											</div>
										</div>
									</Link>
								))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default RightPanel;














