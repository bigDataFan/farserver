package net.gqu.jscript.root;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.gqu.utils.RhinoUtils;

import org.mozilla.javascript.NativeObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoException;

public class ScriptDBCursor {
	private DBCursor cursor;
	
	private NativeObject[] extractedList;
	
	public ScriptDBCursor(DBCursor cursor) {
		super();
		this.cursor = cursor;
	}

	public boolean hasNext() {
		return cursor.hasNext();
	}

	public ScriptDBCursor sort(NativeObject no) {
		Map<String, Object> map = RhinoUtils.nativeObjectToMap(no);
		
		
		for (String key : map.keySet()) {
			if (map.get(key) instanceof Boolean) {
				map.put(key, (Boolean)map.get(key)==true?1:0);
			}
		}
		
		return new ScriptDBCursor(cursor.sort(new BasicDBObject(map)));
	}
	
	

	public ScriptDBCursor skip(Object obj) {
		if (obj instanceof String){
			return skipi(Integer.valueOf((String)obj));
		} else if (obj instanceof Integer) {
			return skipi((Integer)obj);
		} else {
			return this;
		}
	}
	
	private ScriptDBCursor skipi(int n) {
		return new ScriptDBCursor(cursor.skip(n));
	}
	
	public ScriptDBCursor limit(Object j) {
		if (j instanceof String){
			return new ScriptDBCursor(cursor.limit(Integer.valueOf((String)j)));
		} else if (j instanceof Integer) {
			return new ScriptDBCursor(cursor.limit((Integer)j));
		} else {
			return this;
		}
	}
	
	public int count() throws MongoException {
		return cursor.count();
	}
	

	public int size() throws MongoException {
		return cursor.size();
	}

	public NativeObject next() {
		return RhinoUtils.mapToNativeObject(cursor.next().toMap());
	}
	
	public long sumValue(String key) {
		long total  = 0;
		while (cursor.hasNext()) {
			DBObject o = cursor.next();
			Object value = o.get(key);
			
			if (value instanceof Number) {
				total += ((Number)value).longValue();
			}
		}
		return total;
	}
	
	
	public NativeObject[] toArray() {
		if (extractedList==null) {
			List<NativeObject> result = new ArrayList<NativeObject>();
			
			while (cursor.hasNext()) {
				DBObject dbObject = (DBObject) cursor.next();
				result.add(RhinoUtils.mapToNativeObject(dbObject.toMap()));
			}
			
			extractedList = result.toArray(new NativeObject[result.size()]);
		}
		return extractedList;
	}
}
