import React from 'react';
import { MtFieldElement } from '../../components/MtEditorField/MtEditorField';
import { RowData } from '../../definitions/custom';

interface getUpdatedParsedDataArgs {
  parsedData: React.MutableRefObject<RowData[]>;
  editedFields: React.RefObject<MtFieldElement>[];
}

export default function getUpdatedParsedData(args: getUpdatedParsedDataArgs) {
  const { editedFields, parsedData } = args;

  const tmp = parsedData.current;

  for (const field of editedFields) {
    if (field.current) {
      const kid = field.current.getKid().split('-');

      tmp[parseFloat(kid[0])].data[parseFloat(kid[1])] =
        field.current.getValue() as string;
    }
  }

  return tmp;
}
