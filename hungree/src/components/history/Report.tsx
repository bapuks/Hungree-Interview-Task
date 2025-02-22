import React from "react";
import { IReport, RootState, Changes } from "../../redux/types";
import { useSelector } from "react-redux";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  ITableColumn
} from "../util/SectionTable";
import styled from "styled-components";
import ReportChanges from "./ReportChanges";
import { shouldLog } from "../../constants/util";
import { ExpandableRow } from "../util/ExpandableRow";

const ReportWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
`;

const ReportHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 15px;
`;

const HeaderText = styled.p`
  text-align: ${(props: { align: string }) => props.align};
`;

const useReport = () =>
  useSelector((state: RootState) => state.reports.report.report) as IReport;

const localeStringOpts = {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
};

const Report: React.FC = () => {
  const report = useReport();
  shouldLog("Loaded report: ", report);

  const reversedChangelog = React.useMemo(() => {
    let arr = [...report.changeLog];
    return arr.reverse();
  }, [report.changeLog]);

  const date = new Date(report.date);
  const localeDateString = date.toLocaleDateString("default", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const localeTimeString = date.toLocaleTimeString("default");
  const lastChangedBy =
    report.changeLog[report.changeLog.length - 1].changedBy.name;

  return (
    <ReportWrapper>
      <ReportHeader>
        <HeaderText align="left">{localeDateString}</HeaderText>
        <HeaderText align="right">
          <i>Sist endret </i>
          {localeTimeString} <i>av </i>
          {lastChangedBy}
        </HeaderText>
      </ReportHeader>
      <div>
        {/* Products */}
        <ReportTable
          name="Produkter"
          columns={[
            { name: "ID", width: "20%" },
            { name: "NAME", width: "30%" },
            { name: "KATEGORI", width: "30%" },
            { name: "QUANTITY", width: "20%" }
          ]}
        >
          {report.products.all.map(product => {
            let columns = [
              product.productID,
              product.name,
              product.category.name,
              product.amount
            ];
            return (
              <TableRow
                key={"product_row_" + product.productID}
                columns={columns}
              />
            );
          })}
        </ReportTable>
        {/* Orders */}
        <ReportTable
          name="Bestillinger"
          columns={[
            { name: "ID", width: "20%" },
            { name: "SUPPLIER", width: "30%" },
            { name: "ORDERED", width: "30%" },
            { name: "QUANTITY", width: "20%" }
          ]}
        >
          {report.orders.active.map(order => {
            let columns = [
              order.orderID,
              order.supplier.name,
              new Date(order.dateOrdered).toLocaleString(
                "default",
                localeStringOpts
              ),
              order.ordered.reduce((acc, cur) => {
                acc += cur.amount;
                return acc;
              }, 0)
            ];
            return (
              <TableRow key={"order_row_" + order.orderID} columns={columns} />
            );
          })}
        </ReportTable>
        {/* Sales */}
        <ReportTable
          name="Salg"
          columns={[
            { name: "ID", width: "20%" },
            { name: "COULD", width: "30%" },
            { name: "ORDERED", width: "30%" },
            { name: "QUANTITY", width: "20%" }
          ]}
        >
          {report.sales.active.map(sale => {
            let columns = [
              sale.saleID,
              sale.customer.name,
              new Date(sale.dateOrdered).toLocaleString(
                "default",
                localeStringOpts
              ),
              sale.ordered.reduce((acc, cur) => {
                acc += cur.amount;
                return acc;
              }, 0)
            ];
            return (
              <TableRow key={"sale_row_" + sale.saleID} columns={columns} />
            );
          })}
        </ReportTable>
        {/* Loans */}
        {report.loans && (
          <ReportTable
            name="Loans"
            columns={[
              { name: "ID", width: "15%" },
              { name: "COULD", width: "20%" },
              { name: "ORDERED", width: "20%" },
              { name: "SENT", width: "20%" },
              { name: "AMOUNT", width: "15%" }
            ]}
          >
            {report.loans.active.map(loan => {
              let sent = () => {
                if (loan.dateSent == null) {
                  return "-";
                } else {
                  return new Date(loan.dateSent).toLocaleString(
                    "default",
                    localeStringOpts
                  );
                }
              };
              let columns = [
                loan.loanID,
                loan.customer.name,
                new Date(loan.dateOrdered as string).toLocaleString(
                  "default",
                  localeStringOpts
                ),
                sent(),
                loan.ordered.reduce((acc, cur) => {
                  acc += cur.amount;
                  return acc;
                }, 0)
              ];
              return (
                <TableRow key={"loan_row_" + loan.loanID} columns={columns} />
              );
            })}
          </ReportTable>
        )}
        <ReportTable
          name="change Log"
          columns={[
            { name: "NAME", width: "33%" },
            { name: "E-mail", width: "34%" },
            { name: "GIVEN", width: "33%" }
          ]}
        >
          {reversedChangelog.map((log, i) => {
            let columns = [
              log.changedBy.name,
              log.changedBy.email,
              new Date(log.timeChanged).toLocaleString(
                "default",
                localeStringOpts
              )
            ];
            if ("changes" in log && log.changes.length > 0) {
              return (
                <ExtendedChangeLog
                  key={"log_row_" + i}
                  columns={columns}
                  changes={log.changes}
                />
              );
            } else return <TableRow key={"log_row_" + i} columns={columns} />;
          })}
        </ReportTable>
      </div>
    </ReportWrapper>
  );
};

interface IReportTable {
  name: string;
  columns: ITableColumn[];
}

const TableButton = styled.button`
  width: 100%;
  display: grid;
  place-content: center;
  height: 7vh;
  background-color: lightgray;
  margin-top: 10px;
`;

const ReportTable: React.FC<IReportTable> = ({ name, columns, children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <TableButton onClick={() => setOpen(!isOpen)}>
        <h2 style={{ textAlign: "left", paddingLeft: "10px" }}>{name}</h2>
      </TableButton>
      {isOpen && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            border: "2px solid lightgray"
          }}
        >
          <Table
            style={{
              borderCollapse: "collapse",
              width: "100%"
            }}
          >
            <TableHeader columns={columns} />
            <TableBody>{children}</TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

interface ExtendedProps {
  columns: any[];
  changes: Changes[];
}

const ExtendedChangeLog: React.FC<ExtendedProps> = ({ columns, changes }) => {
  return (
    <ExpandableRow columns={columns}>
      <ChangeWrapper>
        {changes.map((change, i) => (
          <ReportChanges
            index={i}
            key={change.type + "_" + i}
            change={change}
          />
        ))}
      </ChangeWrapper>
    </ExpandableRow>
  );
};

const StyledChangeContent = styled.ul`
  margin-bottom: 20px;
  margin-block-start: 0;
  padding: 1em 2rem;
  background-color: rgb(246, 246, 246);
  border: 2px solid rgb(204, 204, 204);
  border-top: none;
  border-image: initial;
  list-style: none;
`;

const ChangeWrapper: React.FC = ({ children }) => {
  return (
    <tr>
      <td colSpan={3}>
        <StyledChangeContent>{children}</StyledChangeContent>
      </td>
    </tr>
  );
};

export default Report;
