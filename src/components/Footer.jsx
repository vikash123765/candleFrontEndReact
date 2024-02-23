import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const social = [
    {
        icon: <FacebookIcon style={{fontSize: '64px'}}/>,
        href: "#"
    },
    {
        icon: <InstagramIcon style={{fontSize: '64px'}}/>,
        href: "#"
    },
    {
        icon: <WhatsAppIcon style={{fontSize: '64px'}}/>,
        href: "#"
    },
]

export default function Footer() {
    return (
        <footer>
            <div id="footer-items">

                <div className="footer-item">
                    <h4>Contact us</h4>
                    <ul>
                        <li>
                            Phone: +00 000 000 0000
                        </li>
                        <li>
                            Address: Gatan 55, Stockholm, SE
                        </li>
                    </ul>
                </div>

                <div className="footer-item-socialmedia">
                    <h4>Social media</h4>
                    {social.map((s, i) => (
                        <a href={s.href} key={s.href+i} target="_blank">
                            {s.icon}
                        </a>
                    ))}
                </div>

                <div className="footer-item">
                    <h4>Another section</h4>
                    <ul>
                        <li>Item</li>
                        <li>Item</li>
                        <li>Item</li>
                    </ul>
                </div>

                <div className="footer-item">
                    <h4>Another section</h4>
                    <ul>
                        <li>Item</li>
                        <li>Item</li>
                        <li>Item</li>
                    </ul>
                </div>

            </div>
        </footer>
    )
}