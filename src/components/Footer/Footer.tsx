import pinAlt from "@/assets/icons/pin-alt.svg";
import phone from "@/assets/icons/phone.svg";
import clock from "@/assets/icons/clock.svg";
import X from "@/components/Footer/components/X.tsx";
import Instagram from "@/components/Footer/components/Instagram.tsx";
import Facebook from "@/components/Footer/components/Facebook.tsx";
const Footer = () => {
  return (
    <footer id="footer">
      <div className="col1">
        <h1 className="footer-h1">
          Sip, Savor, Smile.{" "}
          <span className="footer2-h1">It’s coffee time!</span>
        </h1>
        <h2 className="footer2-h1 display-none">It’s coffee time!</h2>
        <div>
          <a href="https://x.com/?lang=en">
            <X />
          </a>
          <a href="https://www.instagram.com/">
            <Instagram />
          </a>
          <a href="https://www.facebook.com/">
            <Facebook />
          </a>
        </div>
      </div>
      <div className="col2">
        <h1>Contact us</h1>
        <div className="col2div">
          <a href="https://maps.app.goo.gl/Nx8zerqsCmtJAbyL7">
            <img src={pinAlt} alt="Location Pin" />
            <p>8558 Green Rd., LA</p>
          </a>
        </div>
        <div className="col2div">
          <img src={phone} alt="Phone Icon" />
          <a href="tel:+16035550123">+1 (603) 555-0123</a>
        </div>
        <div className="col2div">
          <img src={clock} alt="Clock Icon" />
          <p>Mon-Sat: 9:00 AM – 23:00 PM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
