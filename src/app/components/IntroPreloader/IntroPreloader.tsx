import NavLogo from "../NavHeader/logo";
import styles from "./IntroPreloader.module.css";

export default function IntroPreloader() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.logo}>
        <NavLogo />
      </div>
    </div>
  );
}
