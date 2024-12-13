/** Day 2 Solution */
export function solution(rawReports: string[]): { toString: Function }[] {

	const reports = rawReports.map(report => report.split(" ").map(Number));
	
	const totalSafe = [0, 0];

	const isSafe = (report: number[]) => {

		const direction = Math.sign(report[1] - report[0]);
		for (let i = 1; i < report.length; i++) {
			const diff = report[i] - report[i - 1];
			const absDiff = Math.abs(diff);
			if (Math.sign(diff) !== direction || absDiff < 1 || absDiff > 3) {
				return false;
			}
		}
		return true;
	};

	for (const report of reports) {

		if (isSafe(report)) {
			totalSafe[0]++;
			totalSafe[1]++;
			continue;
		}

		for (const index in report) {
			const trimmed = report.filter((_, i) => +i !== +index);
			if (isSafe(trimmed)) {
				totalSafe[1]++;
				break;
			}
		}
	}

	return totalSafe;
};