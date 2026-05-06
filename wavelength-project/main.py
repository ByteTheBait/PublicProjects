import cv2
import numpy as np
import time

# --- Settings ---
CAM_W, CAM_H = 640, 400  # Camera dimensions
DASH_H = 400             # Dashboard height
TOTAL_H = CAM_H + DASH_H
GRID_SIZE = 10
WL_RED, WL_VIOLET = 750, 380

def draw_rounded_rect(img, top_left, bottom_right, color, thickness, radius=15):
    x1, y1 = top_left
    x2, y2 = bottom_right
    cv2.line(img, (x1+radius, y1), (x2-radius, y1), color, thickness)
    cv2.line(img, (x1+radius, y2), (x2-radius, y2), color, thickness)
    cv2.line(img, (x1, y1+radius), (x1, y2-radius), color, thickness)
    cv2.line(img, (x2, y1+radius), (x2, y2-radius), color, thickness)
    cv2.ellipse(img, (x1+radius, y1+radius), (radius, radius), 180, 0, 90, color, thickness)
    cv2.ellipse(img, (x2-radius, y1+radius), (radius, radius), 270, 0, 90, color, thickness)
    cv2.ellipse(img, (x1+radius, y2-radius), (radius, radius), 90, 0, 90, color, thickness)
    cv2.ellipse(img, (x2-radius, y2-radius), (radius, radius), 0, 0, 90, color, thickness)

class LabDashboard:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.mouse_pos = (CAM_W//2, CAM_H//2)
        
        # Color Data Storage
        self.live_data = {"bgr": [0,0,0], "hsv": [0,0,0], "wl": 500}
        self.locked_data = {"bgr": [100,100,100], "hsv": [0,0,0], "wl": 500}
        
        cv2.namedWindow("Color Lab")
        cv2.setMouseCallback("Color Lab", self.on_mouse)

    def on_mouse(self, event, x, y, flags, param):
        # Only update mouse pos if we are in the top half (camera)
        if y < CAM_H:
            self.mouse_pos = (x, y)
            # Lock color on left click
            if event == cv2.EVENT_LBUTTONDOWN:
                self.locked_data = self.live_data.copy()

    def get_wavelength(self, hue):
        return WL_RED - (hue / 179.0) * (WL_RED - WL_VIOLET)

    def draw_widget(self, canvas, x, y, w, h, title, bgr, hsv, wl, is_locked=False):
        tl, br = (x, y), (x + w, y + h)
        border_col = (0, 255, 0) if is_locked else (200, 200, 200)
        
        # Background
        cv2.rectangle(canvas, tl, br, (30, 30, 30), -1)
        draw_rounded_rect(canvas, tl, br, border_col, 2)
        
        # Text Info
        header = f"{title} {'(LOCKED)' if is_locked else '(LIVE)'}"
        cv2.putText(canvas, header, (x+15, y+30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, border_col, 1)
        
        rgba_txt = f"RGBA: {bgr[2]}, {bgr[1]}, {bgr[0]}, 255"
        hsv_txt = f"HSV:  {hsv[0]}, {hsv[1]}, {hsv[2]}"
        wl_txt = f"WL:   {int(wl)}nm"
        
        for i, txt in enumerate([rgba_txt, hsv_txt, wl_txt]):
            cv2.putText(canvas, txt, (x+15, y+60+(i*25)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)

        # Waveform inside widget
        t = time.time() * 10
        freq = 1000 / wl
        points = []
        for wx in range(x + 20, x + w - 20):
            wy = int((y + 160) + 20 * np.sin(wx * 0.1 * freq + t))
            points.append((wx, wy))
        for i in range(len(points) - 1):
            cv2.line(canvas, points[i], points[i+1], tuple(bgr), 2)

    def run(self):
        while True:
            ret, frame = self.cap.read()
            if not ret: break
            frame = cv2.resize(cv2.flip(frame, 1), (CAM_W, CAM_H))

            # --- Analysis Logic ---
            mx, my = np.clip(self.mouse_pos[0], 5, CAM_W-6), np.clip(self.mouse_pos[1], 5, CAM_H-6)
            roi = frame[my-5:my+5, mx-5:mx+5]
            
            if roi.size > 0:
                bgr = np.median(roi, axis=(0, 1)).astype(int).tolist()
                hsv = cv2.cvtColor(np.uint8([[bgr]]), cv2.COLOR_BGR2HSV)[0][0].tolist()
                self.live_data = {"bgr": bgr, "hsv": hsv, "wl": self.get_wavelength(hsv[0])}

            # --- Construct Final GUI ---
            # Create a blank black canvas for the dashboard
            dashboard = np.zeros((DASH_H, CAM_W, 3), dtype=np.uint8)
            
            # Draw Live Widget (Left)
            self.draw_widget(dashboard, 20, 20, 290, 360, "SENSORS", 
                            self.live_data['bgr'], self.live_data['hsv'], self.live_data['wl'])
            
            # Draw Locked Widget (Right)
            self.draw_widget(dashboard, 330, 20, 290, 360, "DATA ARCHIVE", 
                            self.locked_data['bgr'], self.locked_data['hsv'], self.locked_data['wl'], True)

            # Combine Camera and Dashboard
            combined = np.vstack((frame, dashboard))
            
            # Crosshair on camera
            cv2.drawMarker(combined, (mx, my), (0, 255, 0), cv2.MARKER_CROSS, 15, 2)
            
            cv2.imshow("Color Lab", combined)
            if cv2.waitKey(1) & 0xFF == ord('q'): break

        self.cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    LabDashboard().run()