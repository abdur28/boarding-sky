import { Dashboard } from "@/components/dashboard/Dashboard";
import { getUser } from "@/lib/data";

const DashboardPage = async () => {
    const user = await getUser();
    return ( 
        <div>
            <Dashboard userAsString={JSON.stringify(user)}/>
        </div>
    )
};

export default DashboardPage