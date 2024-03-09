"use client";
import Image from "next/image";
import { GrUserAdmin } from "react-icons/gr";

import logo from "@/assets/logoNew.png";
import { LoginModal } from "@/components/LoginModal";

export function Header({
  isLoggedIn,
  handleLogout,
  openModal,
  isModalOpen,
  closeModal,
  handleLogin,
}) {
  return (
    <div className="header">
      <div className="header__inner">
        <div className="header__logo">
          <Image src={logo} className="header__logo-img" alt="logo" />
          <span className="logo-span">Price Medicine</span>
        </div>

        <div>
          {isLoggedIn ? (
            <div className="admin-flex">
              <GrUserAdmin />
              <button className="header-btn" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <div>
              <button className="header-btn" onClick={openModal}>
                Войти
              </button>
              {isModalOpen && (
                <LoginModal onClose={closeModal} onLogin={handleLogin} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
