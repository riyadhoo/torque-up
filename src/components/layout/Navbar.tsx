
import { NavbarLogo } from "./NavbarLogo";
import { NavbarNavigation } from "./NavbarNavigation";
import { NavbarActions } from "./NavbarActions";
import { MobileMenu } from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg pt-safe sm:pt-0">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <NavbarLogo />

          {/* Desktop Navigation */}
          <NavbarNavigation />

          {/* Desktop Actions */}
          <NavbarActions />

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
