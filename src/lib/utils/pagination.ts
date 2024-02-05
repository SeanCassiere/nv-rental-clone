/**
 *
 * @param currentPage the current pagination page number
 * @param lastPage the total number of possible pages
 * @param maxLength total number of items to be had in a row
 * @returns {Array.<number>} array of numbers to be used in pagination
 */
export function getPaginationWithDoubleEllipsis(
  currentPage: number,
  lastPage: number,
  maxLength: number
): number[] {
  const res: Array<number> = [];

  // handle lastPage less than maxLength
  if (lastPage <= maxLength) {
    for (let i = 1; i <= lastPage; i++) {
      res.push(i);
    }
  }

  // handle ellipsis logics
  else {
    const firstPage = 1;
    const confirmedPagesCount = 3;
    const deductedMaxLength = maxLength - confirmedPagesCount;
    const sideLength = deductedMaxLength / 2;

    // handle ellipsis in the middle
    if (
      currentPage - firstPage < sideLength ||
      lastPage - currentPage < sideLength
    ) {
      for (let j = 1; j <= sideLength + firstPage; j++) {
        res.push(j);
      }

      res.push(NaN);

      for (let k = lastPage - sideLength; k <= lastPage; k++) {
        res.push(k);
      }
    }

    // handle two ellipsis
    else if (
      currentPage - firstPage >= deductedMaxLength &&
      lastPage - currentPage >= deductedMaxLength
    ) {
      const deductedSideLength = sideLength - 1;

      res.push(1);
      res.push(NaN);

      for (
        let l = currentPage - deductedSideLength;
        l <= currentPage + deductedSideLength;
        l++
      ) {
        res.push(l);
      }

      res.push(NaN);
      res.push(lastPage);
    }

    // handle ellipsis not in the middle
    else {
      const isNearFirstPage = currentPage - firstPage < lastPage - currentPage;
      let remainingLength = maxLength;

      if (isNearFirstPage) {
        for (let m = 1; m <= currentPage + 1; m++) {
          res.push(m);
          remainingLength -= 1;
        }

        res.push(NaN);
        remainingLength -= 1;

        for (let n = lastPage - (remainingLength - 1); n <= lastPage; n++) {
          res.push(n);
        }
      } else {
        for (let o = lastPage; o >= currentPage - 1; o--) {
          res.unshift(o);
          remainingLength -= 1;
        }

        res.unshift(NaN);
        remainingLength -= 1;

        for (let p = remainingLength; p >= 1; p--) {
          res.unshift(p);
        }
      }
    }
  }

  return res;
}
