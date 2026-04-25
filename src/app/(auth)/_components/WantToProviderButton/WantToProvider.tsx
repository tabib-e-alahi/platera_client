"use client"
import Link from "next/link";
import "./wantToprovider.css"

export default function WantToProvider() {
  return (
    <div>
      <p className="register-left__footer">
        Fresh ingredients · Local providers · Fast delivery
      </p>
      <Link href="/register-provider" className="register-left__provider-btn">
        🍳 Want to be a provider?
      </Link>
    </div>

  );
}