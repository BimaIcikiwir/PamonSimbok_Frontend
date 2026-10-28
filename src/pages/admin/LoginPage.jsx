import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import logo from "../../assets/logo.png";
import bgLogin from "../../assets/bg-login.png";
import BatikBand from "../../components/ornaments/BatikBand";
import { pesanError } from "../../lib/errors";

export default function LoginPage() {
  const { user, siap, masuk } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [galat, setGalat] = useState("");
  const [kirim, setKirim] = useState(false);

  if (siap && user)
    return <Navigate to={loc.state?.dari || "/kasir/dasbor"} replace />;

  async function submit(e) {
    e.preventDefault();
    setKirim(true);
    setGalat("");
    try {
      await masuk(u.trim(), p);
      nav(loc.state?.dari || "/kasir/dasbor", { replace: true });
    } catch (err) {
      setGalat(pesanError(err));
    } finally {
      setKirim(false);
    }
  }

  return (
    <div
      className="relative grid min-h-dvh place-items-center overflow-hidden bg-soga-800 bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border-2 border-soga-900 bg-gading-50 shadow-kartu">
        <BatikBand />
        <div className="p-7">
          <img
            src={logo}
            alt="Pawon Simbok"
            className="mx-auto h-36 w-36 object-contain"
          />
          <h1 className="mt-1 text-center text-2xl font-extrabold">
            Masuk petugas
          </h1>
          <p className="mb-5 text-center text-sm text-soga-500">
            Khusus kasir dan admin Pawon Simbok.
          </p>

          <form onSubmit={submit} className="space-y-4">
            {galat && (
              <p
                role="alert"
                className="rounded-2xl bg-sambal-100 px-4 py-2 text-sm font-semibold text-sambal-500"
              >
                {galat}
              </p>
            )}
            <Input
              label="Username"
              value={u}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
            <Input
              label="Kata sandi"
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              ukuran="lg"
              className="w-full"
              loading={kirim}
            >
              Masuk
            </Button>
          </form>
          <p className="mt-5 text-center text-sm">
            <Link
              to="/"
              className="text-soga-500 underline-offset-4 hover:underline"
            >
              Kembali ke halaman pelanggan
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
