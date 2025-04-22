from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 啟動 WebDriver
driver = webdriver.Chrome()

try:
    # 開啟目標網站
    driver.get("http://localhost:3000/general")

    # 等待元素載入
    driver.implicitly_wait(0.5)

    # 登入按鈕
    login_button = driver.find_element(By.CSS_SELECTOR, "button.login-button")
    login_button.click()

    # 輸入帳號和密碼
    text_box3 = driver.find_element(By.CSS_SELECTOR, "div input[placeholder='請輸入電子信箱']")
    text_box4 = driver.find_element(By.CSS_SELECTOR, "div input[placeholder='請輸入密碼']")
    text_box3.send_keys("410200252@m365.fju.edu.tw")
    text_box4.send_keys("AA779861")

    # 點擊登入系統按鈕
    login_system_button = driver.find_element(By.XPATH, "//button[contains(text(), '登入系統')]")
    login_system_button.click()

    # 等待模態框中的確定按鈕
    confirm_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '確定')]"))
    )
    confirm_button.click()

    # 找到其他按鈕並點擊
    ask_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button.add-button"))
    )
    ask_button.click()

    # 找到標題和內文的輸入框
    text_box1 = driver.find_element(By.CSS_SELECTOR, "div.modal-field input[type='text']")
    text_box2 = driver.find_element(By.CSS_SELECTOR, "div.modal-field textarea")

    # 輸入測試資料
    text_box1.send_keys("KKtesttitle")
    text_box2.send_keys("Kcontent")

    # 提交表單
    submit_button = driver.find_element(By.CSS_SELECTOR, ".submit-button")
    submit_button.click()

    print("測試成功！")
except Exception as e:
    print(f"測試失敗，錯誤訊息：{e}")
finally:
    # 關閉瀏覽器
    driver.quit()