package com.postgresql.SpringBoot_Service.util;

public class GradeCalculator {
    // Point thresholds for each grade
    private static final int THRESHOLD_10 = 91;
    private static final int THRESHOLD_9 = 81;
    private static final int THRESHOLD_8 = 71;
    private static final int THRESHOLD_7 = 61;
    private static final int THRESHOLD_6 = 54;

    public static int calculateGrade(int points) {
        if (points >= THRESHOLD_10) return 10;
        if (points >= THRESHOLD_9) return 9;
        if (points >= THRESHOLD_8) return 8;
        if (points >= THRESHOLD_7) return 7;
        if (points >= THRESHOLD_6) return 6;
        return 5;
    }

    public static boolean isSubjectCompleted(int grade) {
        return grade >= 6;
    }

    public static String getGradeDescription(int points) {
        int grade = calculateGrade(points);
        return switch (grade) {
            case 10 -> "Izvanredan";
            case 9 -> "Odličan";
            case 8 -> "Vrlo dobar";
            case 7 -> "Dobar";
            case 6 -> "Dovoljan";
            default -> "Nedovoljan";
        };
    }
}