import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {toast} from "react-hot-toast";

const useFollow = () => {

    const queryClient = useQueryClient();

    const {mutate: follow, isPending} = useMutation({
        mutationFn : async(userId) => {
            try {
                const res=await fetch(`https://twitter-backend-td0a.onrender.com/api/users/follow/${userId}`, {
                    method : "POST",
                    credentials: "include",
                })
                const data=await res.json();
                if (!res.ok) throw new Error(data.error || "something went wrong");
                return data;
            }
            catch(error)
            {
                throw new Error(error);
            }
        },
        onSuccess : () => {
            Promise.all([
                queryClient.invalidateQueries({queryKey : ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey : ["authUser"]}),
                queryClient.invalidateQueries({queryKey : ["followedUsers"]})
            ])
        },
        onError : (error) => {
            toast.error(error.message);
        }
    })
     return {follow, isPending}
}

export default useFollow