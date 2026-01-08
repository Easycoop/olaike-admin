import {useGetSocietyMembersSummary} from "../../redux/actions/societyAction";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MembersSummary from "./MembersSummary";


const SocietyMembers = () => {
     const getSocietyMembers = useGetSocietyMembersSummary();
     const { groupId } = useParams();
    // state variables
    // const [name , setName] = useState('');
    // const [description , setDescription] = useState('');
    // const [entranceFee , setEntranceFee] = useState('');
    const [members , setMembers] = useState([]);
     
    const handleGetSociety = async () => {

        try {
        const response = await getSocietyMembers(groupId);
        // console.log(response);
        
        if (
            response?.payload.status === true ||
            response?.payload.status === "success"
        ) {
            // setName(response.payload.data.name);
            // setDescription(response.payload.data.description);
            // setEntranceFee(response.payload.data.entranceFee);
            setMembers(response.payload.data.Users)
            return;
        } else {
            console.log(response.message);
        }
        } catch (error) {
            console.log(error.response.message);
        } 
    };

    useEffect( () => {
        handleGetSociety();
    }, []);


  return (
    <>
        <MembersSummary members={members} />
    </>
  );
};

export default SocietyMembers;
