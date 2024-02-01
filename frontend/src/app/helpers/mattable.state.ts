import { MatTableDataSource, MatTableDataSourcePaginator } from "@angular/material/table";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";

export class MatTableState {
    public sortActive: string;
    public sortDirection: 'asc' | 'desc' = 'asc';
    public pageIndex: number = 0;
    public pageSize: number;
    public filter: string = '';

    constructor(active: string, direction: 'asc' | 'desc', pageSize: number) {
        this.sortActive = active;
        this.sortDirection = direction;
        this.pageSize = pageSize;
    }

    public restoreState(dataSource: MatTableDataSource<any>) {
        this.setSort(dataSource.sort!, this.sortActive, this.sortDirection);
        this.setPage(dataSource.paginator!, this.pageIndex, this.pageSize);
        this.setFilter(dataSource, this.filter);
    }

    public bind(dataSource: MatTableDataSource<any>) {
        dataSource.sort?.sortChange.subscribe((e: { active: string, direction: 'asc' | 'desc' }) => {
            this.sortActive = e.active;
            this.sortDirection = e.direction;
        });
        dataSource.paginator?.page.subscribe((e: PageEvent) => {
            this.pageIndex = e.pageIndex;
            this.pageSize = e.pageSize;
        });
    }

    // see: https://github.com/angular/components/issues/10242#issuecomment-470726829
    private setSort(sort: MatSort, active: string, direction: 'asc' | 'desc') {
        if (active) {
            sort.sort({ id: '', start: direction, disableClear: false });
            sort.sort({ id: active, start: direction, disableClear: false });
            const header = sort.sortables.get(active) as MatSortHeader;
            if (header)
                header._setAnimationTransitionState({ toState: 'active' });
        }
    }

    // see: https://github.com/angular/components/issues/8417#issuecomment-453253715
    private setPage(paginator: MatTableDataSourcePaginator, pageIndex: number, pageSize: number) {
        paginator.pageIndex = pageIndex;
        paginator.pageSize = pageSize;
    }

    private setFilter(dataSource: MatTableDataSource<any>, filter: string) {
        dataSource.filter = filter;
    }

}
