@echo off
echo Uploading changes to GitHub...

cd /d "%~dp0"
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Update site with dropshipping simulation features similar to Shopify and WooCommerce"
"C:\Program Files\Git\bin\git.exe" push

echo.
echo If successful, your updated site is now on GitHub!
echo The site now includes advanced dropshipping simulation features including:
echo - Supplier management and product importing
echo - Inventory syncing with suppliers
echo - Order routing and fulfillment
echo - Automated shipping calculations
echo - Marketing tools like abandoned cart recovery
echo.
echo Press any key to exit
pause 