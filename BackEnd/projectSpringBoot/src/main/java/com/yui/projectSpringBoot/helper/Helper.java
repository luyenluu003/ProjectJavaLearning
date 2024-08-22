package com.yui.projectSpringBoot.helper;

import com.yui.projectSpringBoot.entity.OurUsers;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
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
            XSSFSheet sheet = workbook.getSheetAt(0);
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
                                user.setPassword(passwordEncoder.encode(cell.getStringCellValue()));
                            } else if (cell.getCellType() == CellType.NUMERIC) {
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
                        case 6:
                            if (cell.getCellType() == CellType.STRING) {
                                String cellValue = cell.getStringCellValue().trim().toLowerCase();
                                if (cellValue.equals("true") || cellValue.equals("1")) {
                                    user.setAccountNonLocked(true);
                                } else if (cellValue.equals("false") || cellValue.equals("0")) {
                                    user.setAccountNonLocked(false);
                                } else {
                                    throw new IllegalArgumentException("Invalid value for accountNonLocked: " + cellValue);
                                }
                            } else if (cell.getCellType() == CellType.NUMERIC) {
                                boolean isLocked = cell.getNumericCellValue() != 0;
                                user.setAccountNonLocked(!isLocked);
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

    public static byte[] exportUsersToExcel(List<OurUsers> users) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            XSSFSheet sheet = workbook.createSheet("Users");

            // Tạo tiêu đề cột
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("id");
            header.createCell(1).setCellValue("name");
            header.createCell(2).setCellValue("email");
            header.createCell(3).setCellValue("password");
            header.createCell(4).setCellValue("address");
            header.createCell(5).setCellValue("role");
            header.createCell(5).setCellValue("account_non_locked");

            // Thêm dữ liệu người dùng
            int rowNum = 1;
            for (OurUsers user : users) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getName());
                row.createCell(2).setCellValue(user.getEmail());
                row.createCell(3).setCellValue(user.getPassword());
                row.createCell(4).setCellValue(user.getAddress());
                row.createCell(5).setCellValue(user.getRole());
                row.createCell(6).setCellValue(user.isAccountNonLocked());
            }

            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


}
