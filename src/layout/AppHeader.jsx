import { Link, useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import Button from "../components/ui/button/Button";
import { IoMdLogOut } from "react-icons/io";
import { logout as logoutUser } from "../api/auth";

function AppHeader({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (!inputRef.current) return;

        const isFocused = document.activeElement === inputRef.current;

        if (isFocused) {
          inputRef.current.blur();
        } else {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const logout = () => {
    logoutUser();
    navigate("/sign-in", { replace: true });
  };


  return (
    <header className="sticky top-0 z-50 flex w-full bg-white border-b border-gray-200 h-18">
      <div className="flex items-center justify-between w-full px-4 py-3">

        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path
              d="M1 1H19M1 7H19M1 13H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* Right side placeholder */}
        <div className="flex gap-5 items-center">
          {/* Search
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                  <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" fill="" />
                  </svg>
                </span>
                <input ref={inputRef} type="text" placeholder="Search or type command..." className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 xl:w-[430px]" />

                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500"> ⌘ K </button>
              </div>
            </form>
          </div> */}

          <div>
            <Button type="submit"
              className="w-full"
              size="sm"
              variant="logout"
              startIcon={<IoMdLogOut size={18} />}
              onClick={logout}
            >
              Logout
            </Button>
          </div>

          {/* Logo
          <Link to="/">
            <img src="../images/logo/dayhike-logo.png" alt="Logo" className="h-8" />
          </Link> */}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
