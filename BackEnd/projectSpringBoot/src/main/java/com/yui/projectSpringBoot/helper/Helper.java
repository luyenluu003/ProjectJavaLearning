package com.yui.projectSpringBoot.helper;

import com.yui.projectSpringBoot.entity.OurUsers;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Helper {

    private PasswordEncoder passwordEncoder;

    public static boolean checkExcelFormat(MultipartFile file) {
        String contentType = file.getContentType();
        if(contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")){
            return true;
        }else{
            return false;
        }
    }

    public static List<OurUsers> convertExceltoListOfOurUsers(InputStream is,PasswordEncoder passwordEncoder) {
        List<OurUsers> list = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(is);
            XSSFSheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên không quan tâm tên sheet
            int rowNumber = 0;
            Iterator<Row> iterator = sheet.iterator();

            while (iterator.hasNext()) {
                Row row = iterator.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                Iterator<Cell> cells = row.iterator();
                int cid = 0;

                OurUsers user = new OurUsers();

                while (cells.hasNext()) {
                    Cell cell = cells.next();

                    switch (cid) {
                        case 0:
                            if (cell.getCellType() == CellType.NUMERIC) {
                                user.setId((int) cell.getNumericCellValue());
                            }
                            break;
                        case 1:
                            if (cell.getCellType() == CellType.STRING) {
                                user.setName(cell.getStringCellValue());
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                user.setName(String.valueOf(cell.getNumericCellValue()));
                            }
                            break;
                        case 2:
                            if (cell.getCellType() == CellType.STRING) {
                                user.setEmail(cell.getStringCellValue());
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                user.setEmail(String.valueOf(cell.getNumericCellValue()));
                            }
                            break;
                        case 3:
                            if (cell.getCellType() == CellType.STRING) {
                                // Mã hóa mật khẩu chuỗi
                                user.setPassword(passwordEncoder.encode(cell.getStringCellValue()));
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                // Mã hóa mật khẩu dạng số
                                user.setPassword(passwordEncoder.encode(String.valueOf(cell.getNumericCellValue())));
                            }
                            break;
                        case 4:
                            if (cell.getCellType() == CellType.STRING) {
                                user.setAddress(cell.getStringCellValue());
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                user.setAddress(String.valueOf(cell.getNumericCellValue()));
                            }
                            break;
                        case 5:
                            if (cell.getCellType() == CellType.STRING) {
                                user.setRole(cell.getStringCellValue());
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                user.setRole(String.valueOf(cell.getNumericCellValue()));
                            }
                            break;
                        default:
                            break;
                    }
                    cid++;
                }
                list.add(user);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


}
