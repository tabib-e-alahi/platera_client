// src/components/home/AppDownload.tsx
import "./app-download.css";

export default function AppDownload() {
  return (
    <section className="app-download">
      <div className="container app-download__inner">
        <div className="app-download__content">
          <h2 className="app-download__title">
            Get the Platera App
          </h2>
          <p className="app-download__subtitle">
            Order faster, track in real-time, and get exclusive
            app-only deals. Available on iOS and Android.
          </p>
          <div className="app-download__buttons">
            <button className="app-download__btn app-download__btn--solid">
              🍎 Download for iOS
            </button>
            <button className="app-download__btn app-download__btn--outline">
              🤖 Download for Android
            </button>
          </div>
        </div>

        <div className="app-download__phone">
          <div className="app-download__phone-mockup">
            <span>📱</span>
          </div>
        </div>
      </div>
    </section>
  );
}