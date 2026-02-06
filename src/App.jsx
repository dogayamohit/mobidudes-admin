import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import NotFound from "./pages/OtherPage/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

import ContctTable from "./pages/ContactManagement/ContactTable";
import ViewContactUser from "./pages/ContactManagement/ViewUser";

import AllBlogs from "./pages/BlogManagement/AllBlogs";
import AddBlog from "./pages/BlogManagement/AddBlog";
import EditBlogs from "./pages/BlogManagement/EditBlog";
import AllBlogcategory from "./pages/BlogManagement/AllBlogcategory";
import AddCategory from "./pages/BlogManagement/AddCategory";
import EditBlogsCategory from "./pages/BlogManagement/EditBlogsCategory";

import CareerTable from "./pages/CareerManagement/CareerTable";
import CareerPostView from "./pages/CareerManagement/CareerDetailView";

import ServiceTable from "./pages/ServiceManagement/ServicesTable";
import EditService from "./pages/ServiceManagement/EditService";
import AddService from "./pages/ServiceManagement/AddService";
import ServiceCategoryTable from "./pages/ServiceManagement/ServiceCategoryTable";
import AddServiceCategory from "./pages/ServiceManagement/AddServiceCategory";
import EditServiceCategory from "./pages/ServiceManagement/EditServiceCategory";

import AboutusTable from "./pages/Aboutus/AboutusTable";
import AboutEdit from "./pages/Aboutus/AboutEdit";

import FaqTable from "./pages/HomeManagement/FaqTable";
import AddFaq from "./pages/HomeManagement/AddFaq";
import EditFaq from "./pages/HomeManagement/EditFaq";

import SignIn from "./pages/Auth/SignIn";

import AllPortfolio from "./pages/PortfolioManagement/AllPortfolio";
import EditPortfolio from "./pages/PortfolioManagement/EditPortfolio";
import AddPortfolio from "./pages/PortfolioManagement/AddPortfolio";
import AllPortfolioCategory from "./pages/PortfolioManagement/AllPortfolioCategory";
import AddPortfolioCategory from "./pages/PortfolioManagement/AddPortfolioCategory";
import EditPortfolioCategory from "./pages/PortfolioManagement/EditPortfolioCategory";
import ReviewTable from "./pages/HomeManagement/ReviewTable";
import ReviewView from "./pages/HomeManagement/ReviewView";

import OpenJobTable from "./pages/CareerManagement/OpenJobTable";
import OpenJobEdit from "./pages/CareerManagement/OpenJobEdit";
import AddOpenjob from "./pages/CareerManagement/AddOpenjob";
import AddReview from "./pages/HomeManagement/AddReview";
import EditReview from "./pages/HomeManagement/EditReview";


function App() {
  return (
    <>

      <Routes>
        {/* Protected Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />

            {/* Career Management */}
            <Route path="careers" element={<CareerTable />} />
            <Route path="careers/view/:id" element={<CareerPostView />} />
            <Route path="careers/open-jobs" element={<OpenJobTable />} />
            <Route path="careers/open-jobs/add" element={<AddOpenjob />} />
            <Route path="careers/open-jobs/edit/:id" element={<OpenJobEdit />} />

            {/* About Us */}
            <Route path="about-us" element={<AboutusTable />} />
            <Route path="about-us/edit/:id" element={<AboutEdit />} />

            {/* Blog Management */}
            <Route path="blogs" element={<AllBlogs />} />
            <Route path="blogs/add" element={<AddBlog />} />
            <Route path="blogs/edit/:id" element={<EditBlogs />} />
            <Route path="blog-categories" element={<AllBlogcategory />} />
            <Route path="blog-categories/add" element={<AddCategory />} />
            <Route path="blog-categories/edit/:id" element={<EditBlogsCategory />} />

            {/* Portfolio Management */}
            <Route path="portfolios" element={<AllPortfolio />} />
            <Route path="portfolios/add" element={<AddPortfolio />} />
            <Route path="portfolios/edit/:id" element={<EditPortfolio />} />
            <Route path="portfolio-categories" element={<AllPortfolioCategory />} />
            <Route path="portfolio-categories/add" element={<AddPortfolioCategory />} />
            <Route path="portfolio-categories/edit/:id" element={<EditPortfolioCategory />} />

            {/* Service Management */}
            <Route path="services" element={<ServiceTable />} />
            <Route path="services/add" element={<AddService />} />
            <Route path="services/edit/:id" element={<EditService />} />
            <Route path="service-categories" element={<ServiceCategoryTable />} />
            <Route path="service-categories/add" element={<AddServiceCategory />} />
            <Route path="service-categories/edit/:id" element={<EditServiceCategory />} />

            {/* Contact Management */}
            <Route path="contacts" element={<ContctTable />} />
            <Route path="contacts/view/:id" element={<ViewContactUser />} />

            {/* FAQ Management */}
            <Route path="faqs" element={<FaqTable />} />
            <Route path="faqs/add" element={<AddFaq />} />
            <Route path="faqs/edit/:id" element={<EditFaq />} />

            {/* Reviews */}
            <Route path="reviews" element={<ReviewTable />} />
            <Route path="reviews/view/:id" element={<ReviewView />} />
            <Route path="reviews/add" element={<AddReview />} />
            <Route path="reviews/update/:id" element={<EditReview />} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Auth */}
        <Route path="sign-in" element={<SignIn />} />
      </Routes>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </>


  );
}

export default App;
