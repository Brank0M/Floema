class Detection {
  isPhone() {
    if (!this.isPhoneChecked) {
      this.isPhone =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      this.isPhoneChecked = true;

      this.isPhoneCheck = document.documentElement.classList.contains("phone");
    }
    return this.isPhoneCheck;
  }

  isTablet() {
    if (!this.isTabletChecked) {
      this.isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent);
      this.isTabletChecked = true;

      this.isTabletCheck =
        document.documentElement.classList.contains("tablet");
    }
    return this.isTabletCheck;
  }

  isDesktop() {
    if (!this.isDesktopChecked) {
      this.isDesktop = !this.isPhone() && !this.isTablet();
      this.isDesktopChecked = true;

      this.isDesktopCheck =
        document.documentElement.classList.contains("desktop");
    }
    return this.isDesktopCheck;
  }
}

const DetectionManager = new Detection();

export default DetectionManager;
