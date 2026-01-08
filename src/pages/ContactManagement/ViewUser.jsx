import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { getContactById } from "../../api/contact";
import { getImageUrl } from "../../utils/getImageUrl";

export default function ViewContactUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const data = await getContactById(id);

                setUser({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    company: data.company,
                    mobile: data.mobile,
                    service: data.service_category?.name || "",
                    budget: data.budget,
                    description: data.project_brief,
                    image: getImageUrl(data.image),
                    date: new Date(data.created_at).toISOString().split("T")[0],
                });
            } catch (error) {
                console.error(error);
                navigate("/contact");
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;


    return (
        <>
            <PageBreadcrumb pageTitle="View User" />
            {/* ACTIONS */}
            {
                /* <div className="mt-5 mb-5 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => navigate("/users")}>
                        Back
                    </Button>
                    <Button onClick={() => navigate(`/users/edit/${user.id}`)}>
                        Edit User
                    </Button>
                </div> */
            }

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                {/* HEADER */}
                <div className="mb-10 flex items-center gap-5">
                    <img
                        src={user.image}
                        alt={user.name}
                        className="h-40 w-40 rounded-full object-cover border"
                    />
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* PERSONAL INFO */}
                <Section title="Personal Information">
                    <Grid>
                        {/* <Item label="S.No" value={user.sno} /> */}
                        <Item label="Date" value={user.date} />
                        <Item label="Name" value={user.name} />
                        <Item label="Email" value={user.email} />
                        <Item label="Mobile" value={user.mobile} />
                        <Item label="Service" value={user.service} />
                        <Item label="Budget" value={user.budget} />
                    </Grid>
                </Section>

                {/* ACCOUNT INFO */}
                {/* <Section title="Account Information">
                    <Grid>
                        <Item label="Status" value={user.status} />
                        <Item label="Created At" value={user.createdAt} />
                    </Grid>
                </Section> */}

                {/* VISIBILITY */}
                {/* <Section title="Privacy & Visibility">
                    <Grid>
                        <Item label="Profile Visibility" value={user.profileVisibility} />
                        <Item label="Post Visibility" value={user.postVisibility} />
                        <Item label="DOB Visibility" value={user.dobVisibility} />
                    </Grid>
                </Section> */}

                {/* ABOUT */}
                {/* <Section title="About">
                    <p className="text-sm font-medium text-gray-800">
                        {user.about || "-"}
                    </p>
                </Section> */}




            </div>
        </>
    );
}

/* ===================== REUSABLE UI ===================== */

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800">
            {title}
        </h4>
        {children}
    </div>
);

const Grid = ({ children }) => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
        {children}
    </div>
);

const Item = ({ label, value }) => (
    <div>
        <p className="mb-1 text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">
            {value || "-"}
        </p>
    </div>
);


