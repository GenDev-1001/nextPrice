"use client";
import cn from "classnames";
import { useState } from "react";

export function LoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "1111") {
      onLogin();
      onClose();
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div className={cn("overlay", { active: true })} onClick={onClose}>
      <div
        className={cn("modal", { active: true })}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close-button" onClick={onClose}>
          &times;
        </div>
        <h2>Войти</h2>
        <div className="form">
          <div className="form-group">
            <label htmlFor="login">Войти:</label>
            <input
              type="text"
              placeholder="введите логин..."
              id="login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              placeholder="введите пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="modal-btn" onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
